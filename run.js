#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);

let executable;

if (process.platform === "darwin") {
    // macOS
    executable = path.join(
        __dirname,
        "bin",
        "mac",
        "miniVCS"
    );
} 
else if (process.platform === "win32") {
    // Windows
    executable = path.join(
        __dirname,
        "bin",
        "windows",
        "miniVCS.exe"
    );
} 
else {
    console.error("MiniVCS only supports macOS and Windows.");
    process.exit(1);
}

const proc = spawn(executable, args, {
    stdio: "inherit"
});

proc.on("error", (err) => {
    console.error("Failed to start miniVCS:", err.message);
});

proc.on("close", (code) => {
    if (code !== 0) {
        console.log("\nminiVCS command failed.");
    }

    process.exit(code ?? 1);
});