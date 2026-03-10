#include <iostream>
#include <string>
#include <fstream>
#include <sys/stat.h>
#include <filesystem>
#include <sys/types.h>

using namespace std;
namespace fs = std::filesystem;

void init()
{
    cout << "Initializing " << endl;
    string folderName = ".miniVCS";

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

void add()
{
    cout << "Choose file to be added:- ";
    string filePath;
    cin >> filePath;
    ifstream inFile(filePath, ios::binary);

    if (!inFile)
    {
        cout << "Failed to open file. Make sure it exists!" << endl;
    }

    string line;
    string newPath = ".miniVCS/index/" + filePath;
    ofstream Myfile(newPath, ios::binary);
    Myfile << inFile.rdbuf();

    inFile.close();
    cout << "File Added Successful";
}

void commit()
{
    cout << "Add Commit Number:- ";
    string commitId;
    cin>>commitId;

    string folderPath = ".miniVCS/index/";
    string commitFolder = ".miniVCS/commits/" + commitId; 

    // mkdir(commitFolder.c_str(),0777);

    cout << "Files inside " << folderPath << ":\n";

    // Iterate over all entries in the folder
    for (const auto &entry : fs::directory_iterator(folderPath)) {
        if (fs::is_regular_file(entry.status())) { // only regular files, skip subfolders
            cout << entry.path().filename().string() << endl;
        }
    }

}
void checkout()
{
    cout << "Checking out ";
}
int main()
{
    string a;
    cout << "1) init " << endl;
    cout << "2) add " << endl;
    cout << "3) commit " << endl;
    cout << "4) checkout " << endl;
    cout << "Enter what do you want to do:- ";
    cin >> a;
    if (a == "init")
        init();
    else if (a == "add")
        add();
    else if (a == "commit")
        commit();
    else if (a == "checkout")
        checkout();
    else
        cout << "Wrong Input ";
}