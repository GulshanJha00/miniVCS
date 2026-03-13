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

int commitCount = distance(
    fs::directory_iterator(".miniVCS/commits"),
    fs::directory_iterator{});

bool repoInitialized()
{
    return fs::exists(".miniVCS");
}

void init()
{
    cout << "Initializing " << endl;
    string folderName = ".miniVCS";
    if (repoInitialized())
    {
        cout << "Already Exist\n";
        return;
    }

    if (mkdir(folderName.c_str(), 0777) == 0)
    {
        cout << "miniVCS Initialized Successfully!" << endl;
    }
    else
    {
        cout << "Initialization exists or failed to create." << endl;
    }
    string index = ".miniVCS/index";
    if (mkdir(index.c_str(), 0777) == 0)
    {
        cout << "Index Folder Initialized Successfully!" << endl;
    }
    else
    {
        cout << "Index Folder exists or failed to create." << endl;
    }
    string commit = ".miniVCS/commits";
    if (mkdir(commit.c_str(), 0777) == 0)
    {
        cout << "Commit Folder Initialized Successfully!" << endl;
    }
    else
    {
        cout << "Commit Folder exists or failed to create." << endl;
    }
    string objects = ".miniVCS/object";
    if (mkdir(objects.c_str(), 0777) == 0)
    {
        cout << "Objects Folder Initialized Successfully!" << endl;
    }
    else
    {
        cout << "Objects Folder exists or failed to create." << endl;
    }
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

void commit()
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

    int commitCount = distance(
        fs::directory_iterator(".miniVCS/commits"),
        fs::directory_iterator{});

    string commitId = "commit_" + to_string(commitCount + 1);
    string commitFolder = ".miniVCS/commits/" + commitId;

    fs::create_directories(commitFolder);

    cout << "Enter commit message: ";
    cin.ignore();
    string message;
    getline(cin, message);

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
    vector<string> commits;
    for (auto const &entry : fs::directory_iterator(fullDir))
    {
        string sourceFile = entry.path().filename().string();
        commits.push_back(sourceFile);
    }
    sort(commits.begin(), commits.end());
    reverse(commits.begin(), commits.end()); // latest first
    for (auto a : commits)
    {
        cout << a << endl;
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
    if (argc < 3)
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
        commit();
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
        cout << "Wrong Input ";
}