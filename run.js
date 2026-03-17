#!/usr/bin/env node
const { spawn } = require("child_process")

const args = process.argv.slice(2)

const proc = spawn(__dirname + "/bin/miniVCS", args, {
    stdio: "inherit"
})

proc.on("error", (err) => {
    console.log("Failed to start miniVCS:", err.message)
})

proc.on("close", (code) => {
    if (code !== 0) {
        console.log("\nminiVCS command failed.")
    }

})

//spawn is a function that says:
// ⭐ “Run this executable program”
//This is BIG misconception.
// ❌ does NOT understand C++
// ❌ does NOT compile
// ❌ does NOT read your source
// It ONLY runs the already compiled binary.


// OS does:
// load binary into RAM
// prepare stack / heap
// create PID
// call main(argc, argv)
// So JS is NOT “calling C++ function”
// It is: ⭐ launching a new program