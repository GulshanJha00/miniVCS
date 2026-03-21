# MiniVCS Documentation 🌐

This is the official documentation website for **MiniVCS** — a lightweight distributed version control system built in modern C++ with AWS S3 remote snapshot support.

👉 Live Docs: https://mini-vcs.vercel.app/docs  

---

## 🚀 About MiniVCS

MiniVCS is a simplified Git-inspired version control system designed to help developers understand how real VCS tools work internally.

It demonstrates concepts like:

- Staging area management  
- Snapshot-based commits  
- Repository reconstruction  
- Remote synchronization  
- Distributed cloning  

The system is implemented using **C++17 + NodeJS CLI wrapper + AWS S3.**

---

## 📦 Install MiniVCS

You can install MiniVCS globally via npm:

```bash
npm install -g minivcs
minivcs init
minivcs add .
minivcs commit "first commit"
minivcs log
