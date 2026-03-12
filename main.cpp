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
    if (fs::exists(folderName))
    {
        cout << "Already initialized " << endl;
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

void add()
{
    while (true)
    {
        cout << "Type 'exit' to exit" << endl;
        cout << "Choose file to be added:- ";
        string filePath;
        cin >> filePath;
        if (filePath == "exit")
        {
            cout << "Exited Successful" << endl;
            return;
        }
        if (!fs::exists(filePath))
        {
            cout << "File does not exit " << endl;
            continue;
        }

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
}

void commit()
{
    string folderPath = ".miniVCS/index/";
    if (fs::is_empty(folderPath))
    {
        cout << "Nothing to commit " << endl;
        return;
    }
    cout << "Add Commit Number:- ";
    string commitId;
    cin >> commitId;

    string commitFolder = ".miniVCS/commits/" + commitId;
    if (fs::exists(commitFolder))
    {
        cout << "Commit number already exits " << endl;
        return;
    }

    fs::create_directories(commitFolder);

    for (const auto &entry : fs::directory_iterator(folderPath))
    {
        string fileName = entry.path().filename().string();
        ofstream Myfile(commitFolder + "/" + fileName,ios::binary);
        string sourcePath = folderPath + fileName;
        ifstream inFile(sourcePath, ios::binary);
        Myfile << inFile.rdbuf();
        inFile.close();
        Myfile.close();
        fs::remove(folderPath + fileName);
    }
    cout << "Committed Successfully " << endl;
}

void checkout()
{
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

    string commitName;
    cout << "Enter commit Checkout:- ";
    cin >> commitName;

    string commitsLocation = ".miniVCS/commits/" + commitName;
    if(!fs::exists(commitsLocation)){
        cout<<"Commit number does not exit "<<endl;
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