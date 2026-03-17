#include <iostream>
#include <string>
#include <fstream>
#include <sys/stat.h>
#include <filesystem>
#include <sys/types.h>
#include <vector>
#include <algorithm>
#include <chrono>
#include <ctime>
#include <sstream>
#include <iomanip>


using namespace std;
namespace fs = std::filesystem;

bool repoInitialized()
{
    return fs::exists(".miniVCS");
}

string getTimestamp()
{
    auto now = chrono::system_clock::now();
    time_t t = chrono::system_clock::to_time_t(now);
    tm localTime = *localtime(&t);

    stringstream ss;
    ss << put_time(&localTime, "%Y%m%d_%H%M%S"); // e.g., 20260313_1545
    return ss.str();
}

string getUsername()
{
    ifstream config(".miniVCS/config");
    string line;

    while (getline(config, line))
    {
        if (line.find("username=") == 0)
        {
            return line.substr(9);
        }
    }

    return "default";
}

void init()
{
    cout << "Initializing miniVCS\n";

    string folderName = ".miniVCS";

    if (fs::exists(folderName))
    {
        cout << "Already exists\n";
        return;
    }

    string username;
    cout << "Enter username: ";
    cin >> username;

    fs::create_directories(folderName);
    fs::create_directories(".miniVCS/index");
    fs::create_directories(".miniVCS/commits");
    fs::create_directories(".miniVCS/object");

    ofstream config(".miniVCS/config");
    config << "username=" << username << endl;
    config.close();

    ofstream ignoreFile(".miniVCSignore");

    cout << "miniVCS initialized for user: " << username << endl;
}

void add(const string &path)
{
    if (!repoInitialized())
    {
        cout << "Run init first\n";
        return;
    }

    if (!fs::exists(path))
    {
        cout << "File/Folder does not exist\n";
        return;
    }
    vector<string> ignoreDir;
    string DirIgnore = ".miniVCSignore";
    ifstream ignore(DirIgnore);
    string line;
    while (getline(ignore, line))
    {
        ignoreDir.push_back(line);
    }
    if (fs::is_directory(path))
    {
        // recurse
        for (auto &entry : fs::recursive_directory_iterator(path))
        {
            if (fs::is_directory(entry.path()))
                continue;

            if (entry.path().string().find(".miniVCS") != string::npos)
                continue;

            string relPath = fs::relative(entry.path(), fs::current_path()).string();

            bool ignored = false;

            for (auto &a : ignoreDir)
            {
                if (relPath.find(a) == 0)
                {
                    ignored = true;
                    break;
                }
            }

            if (ignored)
                continue;

            string newPath = ".miniVCS/index/" + relPath;

            fs::create_directories(fs::path(newPath).parent_path());

            ifstream inFile(entry.path(), ios::binary);
            ofstream outFile(newPath, ios::binary);
            outFile << inFile.rdbuf();
        }
    }
    else
    {
        // single file
        string fileName = fs::path(path).filename().string();
        string newPath = ".miniVCS/index/" + fileName;

        fs::create_directories(fs::path(newPath).parent_path());

        ifstream inFile(path, ios::binary);
        ofstream outFile(newPath, ios::binary);
        outFile << inFile.rdbuf();
    }

    cout << "Files added successfully\n";
}

void commit(string message)
{
    if (!repoInitialized())
    {
        cout << "Run init first\n";
        return;
    }

    string folderPath = ".miniVCS/index/";

    if (fs::is_empty(folderPath))
    {
        cout << "Nothing to commit\n";
        return;
    }

    string commitId = "commit_" + getTimestamp();
    string commitFolder = ".miniVCS/commits/" + commitId;

    fs::create_directories(commitFolder);

    ofstream meta(commitFolder + "/meta.txt");
    meta << "Commit: " << commitId << endl;
    meta << "Message: " << message << endl;
    meta.close();

    // Copy all files preserving folder structure
    for (auto &entry : fs::recursive_directory_iterator(folderPath))
    {
        if (fs::is_directory(entry.path()))
            continue;

        string relPath = fs::relative(entry.path(), folderPath).string();
        string newPath = commitFolder + "/" + relPath;

        fs::create_directories(fs::path(newPath).parent_path());

        ifstream inFile(entry.path(), ios::binary);
        ofstream outFile(newPath, ios::binary);
        outFile << inFile.rdbuf();
    }

    // Upload to S3 **after files exist**
    string username = getUsername();
    string bucketName = "s3://minivcs-bucket";

    string command =
        "aws s3 cp " + commitFolder +
        " " + bucketName + "/" + username + "/" + commitId +
        " --recursive";

    system(command.c_str());

    fs::remove_all(folderPath);
    fs::create_directories(folderPath);

    cout << "Committed Successfully and uploaded to S3\n";
}

void checkout(const string &commitName)
{
    if (!repoInitialized())
    {
        cout << "Run init first\n";
        return;
    }

    string indexDir = ".miniVCS/index";

    if (!fs::exists(indexDir))
    {
        cout << "Index folder missing\n";
        return;
    }

    if (!fs::is_empty(indexDir))
    {
        cout << "Please commit staged files before checkout.\n";
        return;
    }

    string username = getUsername();

    // Sync commits from S3
    string command =
        "aws s3 sync s3://minivcs-bucket/" + username + " .miniVCS/commits";
    system(command.c_str());

    string commitFolder = ".miniVCS/commits/" + commitName;

    if (!fs::exists(commitFolder))
    {
        cout << "Commit does not exist\n";
        return;
    }

    // Clean working directory except .miniVCS
    for (auto &entry : fs::directory_iterator(fs::current_path()))
    {
        if (entry.path().filename() == ".miniVCS")
            continue;

        fs::remove_all(entry.path());
    }

    // Restore files from commit
    for (auto &entry : fs::recursive_directory_iterator(commitFolder))
    {
        if (fs::is_directory(entry.path()))
            continue;

        if (entry.path().filename() == "meta.txt")
            continue;

        string relPath = fs::relative(entry.path(), commitFolder).string();
        string newPath = relPath;

        fs::create_directories(fs::path(newPath).parent_path());

        ifstream src(entry.path(), ios::binary);
        ofstream dst(newPath, ios::binary);

        dst << src.rdbuf();
    }

    cout << "Checkout completed: " << commitName << endl;
}


void log()
{
    if (!repoInitialized())
    {
        cout << "Run init first\n";
        return;
    }

    string username = getUsername();

    // download commits from S3
    string command =
        "aws s3 sync s3://minivcs-bucket/" + username + " .miniVCS/commits";
    system(command.c_str());

    string commitDir = ".miniVCS/commits";

    for (auto &entry : fs::directory_iterator(commitDir))
    {
        if (!fs::is_directory(entry))
            continue;

        string metaPath = entry.path().string() + "/meta.txt";

        if (!fs::exists(metaPath))
            continue;

        ifstream meta(metaPath);

        string line;
        string message;

        while (getline(meta, line))
        {
            if (line.find("Message:") != string::npos)
            {
                int pos = line.find(":");
                message = line.substr(pos + 2);
                break;
            }
        }

        cout << entry.path().filename().string()
             << " -> " << message << endl;
    }
}

void status()
{
    if (!repoInitialized())
    {
        cout << "Run init first\n";
        return;
    }

    string indexDir = ".miniVCS/index";

    if (fs::is_empty(indexDir))
    {
        cout << "No files staged\n";
        return;
    }

    cout << "Staged files are:\n";

    for (auto &entry : fs::recursive_directory_iterator(indexDir))
    {
        if (fs::is_directory(entry.path()))
            continue;
        string relPath = fs::relative(entry.path(), indexDir).string();
        cout << relPath << endl;
    }
}

void cloneRepo(const string &username)
{
    string cloneFolder = username;

    if (fs::exists(cloneFolder))
    {
        cout << "Folder '" << cloneFolder << "' already exists\n";
        return;
    }

    fs::create_directories(cloneFolder + "/.miniVCS/index");
    fs::create_directories(cloneFolder + "/.miniVCS/commits");
    fs::create_directories(cloneFolder + "/.miniVCS/object");

    // Save username locally in config
    ofstream config(cloneFolder + "/.miniVCS/config");
    config << "username=" << username << endl;
    config.close();

    // Download commits from S3
    string command = "aws s3 sync s3://minivcs-bucket/" + username + " " + cloneFolder + "/.miniVCS/commits";
    system(command.c_str());

    // Find latest commit
    string latestCommit;
    for (auto &entry : fs::directory_iterator(cloneFolder + "/.miniVCS/commits"))
    {
        if (!fs::is_directory(entry))
            continue;

        string name = entry.path().filename().string();
        if (name > latestCommit)
            latestCommit = name;
    }

    if (latestCommit.empty())
    {
        cout << "No commits found for user " << username << "\n";
        return;
    }

    cout << "Latest commit: " << latestCommit << "\n";
    cout << "Checking out latest commit in '" << cloneFolder << "'...\n";

    // Checkout latest commit safely
    string commitFolder = cloneFolder + "/.miniVCS/commits/" + latestCommit;
    for (auto &entry : fs::recursive_directory_iterator(commitFolder))
    {
        if (fs::is_directory(entry.path()))
            continue;

        if (entry.path().filename() == "meta.txt")
            continue;

        string relPath = fs::relative(entry.path(), commitFolder).string();
        string newPath = cloneFolder + "/" + relPath;

        fs::create_directories(fs::path(newPath).parent_path());

        ifstream src(entry.path(), ios::binary);
        ofstream dst(newPath, ios::binary);
        dst << src.rdbuf();
    }

    cout << "Clone completed safely!\n";
}

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        cout << "Usage:\n";
        cout << "miniVCS init\n";
        cout << "miniVCS add <files>\n";
        cout << "miniVCS commit\n";
        cout << "miniVCS checkout <commit>\n";
        cout << "miniVCS log\n";
        cout << "miniVCS status\n";
        cout << "miniVCS clone <username>\n";

        return 0;
    }
    string command = argv[1];

    if (command == "init")
        init();
    else if (command == "add")
    {
        if (argc < 3)
        {
            cout << "Usage: ./miniVCS add <file>\n";
            return 0;
        }

        string file = argv[2];
        add(file);
    }
    else if (command == "commit")
    {
        if (argc < 3)
        {
            cout << "Usage: ./miniVCS commit '<message>'\n";
            return 0;
        }
        commit(argv[2]);
    }
    else if (command == "checkout")
    {
        if (argc < 3)
        {
            cout << "Usage: ./miniVCS checkout <commit>\n";
            return 0;
        }

        string commitName = argv[2];
        checkout(commitName);
    }
    else if (command == "log")
        log();
    else if (command == "status")
        status();
    else if (command == "clone")
    {
        if (argc < 3)
        {
            cout << "Usage: ./miniVCS clone <username>\n";
            return 0;
        }

        cloneRepo(argv[2]);
    }
    else
    {
        cout << "Usage:\n";
        cout << "miniVCS init\n";
        cout << "miniVCS add <file>\n";
        cout << "miniVCS commit '<message>'\n";
        cout << "miniVCS checkout <commit>\n";
        cout << "miniVCS log\n";
        cout << "miniVCS status\n";
        cout << "miniVCS clone <username>\n";
        return 0;
    }
}