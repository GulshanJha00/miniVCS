# MiniVCS (Mini Version Control System)

MiniVCS is a simplified version control system written in **C++** that mimics basic features of Git.
It allows users to track file changes, create commits, and restore previous versions of files.

## Features

* Initialize a repository
* Add files to staging area
* Commit staged files
* Checkout previous commits
* View commit history
* View staged file status

## Project Structure

```
.miniVCS/
│
├── index/        # Staging area
├── commits/      # Stores commit snapshots
│   └── commit_x/
│        ├── files
│        └── meta.txt
└── objects/      # Reserved for future object storage
```

## Commands

### Initialize repository

```
./miniVCS init
```

Creates the `.miniVCS` directory structure.

---

### Add files

```
./miniVCS add
```

Adds files to the staging area (`index`).

---

### Commit

```
./miniVCS commit '<message>'
```

Creates a new commit and stores a snapshot of staged files.

---

### Checkout

```
./miniVCS checkout
```

Restores files from a specific commit.

---

### Log

```
./miniVCS log
```

Displays commit history.

---

### Status

```
./miniVCS status
```

Shows currently staged files.

---

## Technologies Used

* C++
* STL (`filesystem`, `fstream`, `vector`)
* Linux file system operations

## Future Improvements

* File hashing and object storage
* Diff detection
* Branch support

## Author

Gulshan Kumar


