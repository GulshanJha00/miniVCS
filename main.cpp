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

void init()
{
    cout << "Initializing " << endl;
    string folderName = ".miniVCS";
    if (fs::exists(folderName))
    {
        cout << "Already Exist\n";
        return;
    }

    fs::create_directories(folderName);
    fs::create_directories(".miniVCS/index");
    fs::create_directories(".miniVCS/commits");
    fs::create_directories(".miniVCS/object");

    cout << "miniVCS Initialized Successfully!\n";
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

    if (fs::is_directory(path))
    {
        // recurse
        for (auto &entry : fs::recursive_directory_iterator(path))
        {
            if (fs::is_directory(entry.path()))
                continue; // skip folders

            if (entry.path().string().find(".miniVCS") != string::npos)
                continue;

            string relPath = fs::relative(entry.path(), fs::current_path()).string();
            
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

    // Create meta file
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

    // Clear the index after commit
    fs::remove_all(folderPath);
    fs::create_directories(folderPath);

    cout << "Committed Successfully\n";
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
        cout << "Please commit unsaved files before checkout.\n";
        return;
    }

    string commitFolder = ".miniVCS/commits/" + commitName;

    if (!fs::exists(commitFolder))
    {
        cout << "Commit does not exist\n";
        return;
    }

    for (auto &entry : fs::recursive_directory_iterator(commitFolder))
    {
        if (fs::is_directory(entry.path()))
            continue;

        if (entry.path().filename() == "meta.txt")
            continue;

        // preserve relative path from commit folder
        string relPath = fs::relative(entry.path(), commitFolder).string();
        string newPath = relPath; // copy to current working dir

        fs::create_directories(fs::path(newPath).parent_path());

        ifstream src(entry.path(), ios::binary);
        ofstream dst(newPath, ios::binary);
        dst << src.rdbuf();
    }

    cout << "Checkout completed\n";
}

void log()
{
    if (!repoInitialized())
    {
        cout << "Run init first\n";
        return;
    }
    string fullDir = ".miniVCS/commits";
    if (fs::is_empty(fullDir))
    {
        cout << "You haven't Commited anything yet";
        return;
    }

    cout << "Commits are:- " << endl;
    vector<pair<string, string>> commits;
    for (auto const &entry : fs::directory_iterator(fullDir))
    {
        if (!fs::is_directory(entry.status()))
            continue;

        string commitId = entry.path().filename().string();

        string metaPath = entry.path().string() + "/meta.txt";

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

        meta.close();

        commits.push_back({commitId, message});
    }
    sort(commits.begin(), commits.end());
    reverse(commits.begin(), commits.end()); // latest first
    for (auto &c : commits)
    {
        cout << c.first << " -> " << c.second << endl;
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

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        cout << "Usage:\n";
        cout << "./miniVCS init\n";
        cout << "./miniVCS add <files>\n";
        cout << "./miniVCS commit\n";
        cout << "./miniVCS checkout <commit>\n";
        cout << "./miniVCS log\n";
        cout << "./miniVCS status\n";
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
    else
    {
        cout << "Usage:\n";
        cout << "./miniVCS init\n";
        cout << "./miniVCS add <file>\n";
        cout << "./miniVCS commit '<message>'\n";
        cout << "./miniVCS checkout <commit>\n";
        cout << "./miniVCS log\n";
        cout << "./miniVCS status\n";
        return 0;
    }
}