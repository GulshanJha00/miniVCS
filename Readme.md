# MiniVCS 🚀

A Lightweight Version Control System in C++ with S3 Remote Support

MiniVCS is a simplified distributed version control system inspired by Git.
It is built using **modern C++ (STL + filesystem)** and supports **local commits, staging, checkout, history, cloning, ignore rules, and remote storage using AWS S3.**

This project is designed for learning how real VCS systems work internally — including snapshotting, staging, remote syncing, and repository reconstruction.

---

## ✨ Features

### ✅ Repository Management

* Initialize a repository
* Maintain local VCS metadata inside `.miniVCS`

### ✅ Staging Area (Index)

* Stage **single files or entire folders**
* Recursive directory staging
* Ignore rules support via `.miniVCSignore`

### ✅ Commit System (Snapshot Based)

* Creates **timestamp-based commit IDs**
* Stores full snapshot of staged files
* Saves commit metadata (message + commit id)
* Clears staging area after commit

### ✅ Remote Sync (AWS S3 Integration)

* Automatically uploads commits to S3 after commit
* Downloads commits when viewing log or checkout
* Enables distributed collaboration

### ✅ Checkout System

* Restores working directory to a specific commit
* Prevents checkout if staging area is not clean
* Safely removes current working files (except `.miniVCS`)

### ✅ Commit History (Log)

* Fetches remote commits
* Displays commit id + message

### ✅ Status Command

* Shows currently staged files

### ✅ Clone Repository

* Clone another user's repository from S3
* Automatically checks out **latest commit**
* Creates fully working local repo

### ✅ NodeJS Wrapper (CLI Runner)

* `run.js` acts as command launcher
* Executes compiled C++ binary
* Allows Git-like CLI experience

---

## 📁 Repository Structure

```
.miniVCS/
│
├── index/          → Staging area
├── commits/        → Local commit snapshots
│     └── commit_<timestamp>/
│            ├── files...
│            └── meta.txt
│
├── object/         → Reserved for future object storage
└── config          → Stores username

.miniVCSignore      → Ignore rules
```

---

## ⚙️ Prerequisites

You must have:

* C++17 or higher compiler
* NodeJS
* AWS CLI configured

```
aws configure
```

---

## 🔨 Build Project

```
g++ main.cpp -std=c++17 -o miniVCS
```

Move binary:

```
mkdir -p bin
mv miniVCS bin/
```

---

## ▶️ Run Commands (via Wrapper)

```
node run.js <command>
```

Example:

```
node run.js init
node run.js add src
node run.js commit "initial commit"
node run.js log
```

---

## 📌 Commands

### Initialize Repository

```
node run.js init
```

Creates `.miniVCS` structure and asks for username.

---

### Add Files / Folders

```
node run.js add <path>
```

Examples:

```
node run.js add main.cpp
node run.js add src
```

Supports recursive staging.

---

### Commit

```
node run.js commit "message"
```

What happens internally:

* Snapshot created in `.miniVCS/commits`
* Metadata stored
* Commit uploaded to:

```
s3://minivcs-bucket/<username>/<commit_id>
```

---

### Checkout

```
node run.js checkout <commit_id>
```

* Downloads commits from S3
* Cleans working directory
* Restores files from selected commit

⚠️ Staging area must be empty before checkout.

---

### View Commit History

```
node run.js log
```

Fetches commits from S3 and prints:

```
commit_20260318_010212 -> fixed checkout bug
```

---

### Status

```
node run.js status
```

Shows staged files inside index.

---

### Clone Repository

```
node run.js clone <username>
```

Creates folder:

```
<username>/
```

Then:

* Downloads commits from S3
* Finds latest commit
* Restores working files automatically

---

## 🚫 Ignore Files

Create `.miniVCSignore`

Example:

```
node_modules
build
.git
```

Any path starting with these rules will not be staged.

---

## 🧠 How MiniVCS Works (Concept)

MiniVCS uses a **snapshot strategy (like early Git)**:

1. Files added → copied to index
2. Commit → full snapshot created
3. Snapshot uploaded to S3
4. Checkout → working directory reconstructed

No diff / hashing yet — planned future upgrade.

---

## 🚀 Future Improvements

* File hashing (content-addressable storage)
* True object storage
* Delta / diff commits
* Branch support
* Merge support
* Conflict resolution
* Faster staging via change detection
* Parallel S3 uploads
* Global config support

---

## 👨‍💻 Author

**Gulshan Kumar**

---

## ⭐ Learning Purpose

This project is meant to deeply understand:

* How Git staging works
* How commits are structured
* How distributed VCS sync works
* How working directory reconstruction happens
* How CLI tools launch compiled binaries

---
