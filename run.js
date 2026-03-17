const {spawn} = require("child_process")

const args = process.argv.slice(2)

console.log("\n")
console.log("################################")
console.log("Running:", args.join(" "))
console.log("################################")
console.log("\n")
spawn("./bin/miniVCS",args,{
    stdio: "inherit"
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