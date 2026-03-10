#include <iostream>
#include <string>
#include<fstream>
#include <sys/stat.h>

using namespace std;

void init()
{
    cout << "Initializing "<<endl;
    string folderName = ".miniVCS";

    if(mkdir(folderName.c_str(),0777)==0){
        cout << "Initialized Successfully!" << endl;
    } else {
        cout << "Initialization exists or failed to create." << endl;
    }

}
void add()
{
     cout << "Adding ";
}
void commit()
{
    cout << "Commiting ";
}
void checkout()
{
    cout << "Checking out ";

}
int main()
{
    string a;
    cout<<"1) init "<<endl;
    cout<<"2) add "<<endl;
    cout<<"3) commit "<<endl;
    cout<<"4) checkout "<<endl;
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