#include <iostream>
#include <string>
#include <fstream>
#include <sys/stat.h>
#include <filesystem>
#include <sys/types.h>
#include <vector>
#include <algorithm>

using namespace std;
namespace fs = std::filesystem;

bool repoInitialized()
{
    return fs::exists(".miniVCS");
}

int getNextCommitNumber()
{
    string counterFile = ".miniVCS/commit_counter.txt";
    int commitNumber = 0;

    if (fs::exists(counterFile))
    {
        ifstream in(counterFile);
        in >> commitNumber;
        in.close();
    }

    commitNumber++;

    ofstream out(counterFile);
    out << commitNumber;
    out.close();

    return commitNumber;
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

    // ✅ Create commit counter file
    string counterFile = ".miniVCS/commit_counter.txt";
    ofstream out(counterFile);
    out << 0;
    out.close();

    cout << "miniVCS Initialized Successfully!\n";
}

void add(string filePath)
{
    if (!fs::exists(".miniVCS"))
    {
        cout << "Run init first\n";
        return;
    }

    if (!fs::exists(filePath))
    {
        cout << "File does not exist\n";
        return;
    }

    ifstream inFile(filePath, ios::binary);

    string fileName = fs::path(filePath).filename().string();
    string newPath = ".miniVCS/index/" + fileName;

    ofstream outFile(newPath, ios::binary);
    outFile << inFile.rdbuf();

    cout << "File added successfully\n";
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

    int commitCount = getNextCommitNumber();
    string commitId = "commit_" + to_string(commitCount);
    string commitFolder = ".miniVCS/commits/" + commitId;

    fs::create_directories(commitFolder);

    string metaPath = commitFolder + "/meta.txt";
    ofstream meta(metaPath);

    meta << "Commit: " << commitId << endl;
    meta << "Message: " << message << endl;

    meta.close();

    for (const auto &entry : fs::directory_iterator(folderPath))
    {
        string fileName = entry.path().filename().string();

        ifstream inFile(entry.path(), ios::binary);
        ofstream outFile(commitFolder + "/" + fileName, ios::binary);

        outFile << inFile.rdbuf();

        inFile.close();
        outFile.close();

        fs::remove(entry.path());
    }

    cout << "Committed Successfully\n";
}

void checkout(string commitName)
{
    if (!repoInitialized())
    {
        cout << "Run init first\n";
        return;
    }
    string indexFile = ".miniVCS/index";

    if (!fs::exists(indexFile))
    {
        cout << "Index folder missing\n";
        cout << "Please Initialize before checkout\n";
        return;
    }

    if (!fs::is_empty(indexFile))
    {
        cout << "Please Commit Unsaved Files Before Checkout.\n";
        return;
    }

    string commitsLocation = ".miniVCS/commits/" + commitName;
    if (!fs::exists(commitsLocation))
    {
        cout << "Commit number does not exit " << endl;
        return;
    }

    for (auto const &entry : fs::directory_iterator(commitsLocation))
    {
        string sourceFile = entry.path().string();
        string fileName = entry.path().filename().string();

        ifstream src(sourceFile, ios::binary);
        ofstream dst(fileName, ios::binary);
        dst << src.rdbuf();
    }
    cout << " Checkout Completed " << endl;
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
    string fullDir = ".miniVCS/index";
    if (fs::is_empty(fullDir))
    {
        cout << "No files staged";
        return;
    }

    cout << "Staged files are:- " << endl;
    for (auto const &entry : fs::directory_iterator(fullDir))
    {
        string sourceFile = entry.path().filename().string();
        cout << sourceFile << endl;
    }
}

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        cout << "Usage:\n";
        cout << "./miniVCS init\n";
        cout << "./miniVCS add <file>\n";
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