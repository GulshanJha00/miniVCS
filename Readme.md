# MiniVCS 🚀

A lightweight snapshot-based distributed version control system written in modern C++. Demonstrates how real VCS tools manage staging, commit snapshots, remote syncing, and repository reconstruction.

[![npm](https://img.shields.io/npm/v/minivcs?color=red&style=flat-square)](https://www.npmjs.com/package/minivcs)
[![GitHub](https://img.shields.io/badge/GitHub-GulshanJha00%2Fminivcs-181717?style=flat-square&logo=github)](https://github.com/GulshanJha00/minivcs)

---

## Prerequisites

- Node.js
- AWS CLI configured with valid credentials (`aws configure`)
- An S3 bucket named `minivcs-bucket`

---

## Installation

```bash
npm install -g minivcs
```

---

## Quick Start

```bash
minivcs init           # initialize a repo
minivcs add .          # stage all files
minivcs commit "msg"   # snapshot and upload
minivcs log            # view history
```

---

## Commands

### `minivcs init`
Initializes a new repository in the current directory. Creates a `.miniVCS/` folder with all internal metadata — index, commits, object store, and config.

```bash
minivcs init
# Enter username: gulshan
```

> Run this once per project before any other command.

---

### `minivcs add <path>`
Stages files for the next commit. Accepts a single file, a directory, or `.` for everything. Respects rules in `.miniVCSignore`.

```bash
minivcs add file.cpp
minivcs add src/
minivcs add .
```

Files are copied into `.miniVCS/index/` preserving their relative paths.

---

### `minivcs commit "<message>"`
Takes a snapshot of all staged files, writes metadata, uploads to AWS S3, then clears the staging area.

```bash
minivcs commit "added auth module"
# Commit: commit_20260321_010203
# Message: added auth module
```

> Commit IDs are timestamp-based (`commit_YYYYMMDD_HHMMSS`), so they sort lexicographically.

---

### `minivcs checkout <commit-id>`
Restores the working directory to a specific commit snapshot. Syncs from S3, wipes current files (except `.miniVCS/`), and reconstructs from the snapshot.

```bash
minivcs checkout commit_20260321_010203
```

> Stage or commit any pending changes before running checkout — it will abort if the index is not empty.

---

### `minivcs log`
Syncs commit history from S3 and prints a timeline of all commits with their messages.

```bash
minivcs log
# commit_20260321_010203 -> added auth module
# commit_20260320_183045 -> initial commit
```

---

### `minivcs status`
Lists all files currently staged in the index.

```bash
minivcs status
# Staged files are:
# src/main.cpp
# README.md
```

---

### `minivcs clone <username>`
Clones another user's remote repository from S3 into a new local folder. Automatically checks out their latest commit.

```bash
minivcs clone gulshan
# Latest commit: commit_20260321_010203
# Clone completed safely!
```

---

## Repository Structure

```
.miniVCS/
├── index/      # staging area (files added, not yet committed)
├── commits/    # local commit snapshots
├── object/     # reserved for future use
└── config      # stores username
```

---

## How it Works

MiniVCS uses a **full snapshot model** — no deltas, no content hashing. Each commit is a complete copy of the staged files, uploaded to a shared S3 bucket under the user's namespace (`s3://minivcs-bucket/<username>/<commit-id>`).

```
User → CLI → .miniVCS (local) → AWS S3 (remote)
```

- `add` → copies files into `.miniVCS/index/`
- `commit` → snapshots index → uploads to S3 → clears index
- `checkout` / `log` → syncs from S3 → reads local commits
- `clone` → downloads all commits from S3 → checks out latest

---

## Links

- 📦 [npm package](https://www.npmjs.com/package/minivcs)
- 🐙 [GitHub — GulshanJha00/minivcs](https://github.com/GulshanJha00/minivcs)
- 📖 [Full Documentation](https://github.com/GulshanJha00/minivcs#readme)

---

## Author

Built by [Gulshan Kumar](https://github.com/GulshanJha00) · MIT License