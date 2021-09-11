const { spawn, exec } = require('child_process');
const {timeoutTime} = require("../configs");

const generateExecutableForCCpp = (filePath, executionCommand) => {
    return new Promise((resolve, reject) => {
        exec(`${executionCommand} ${filePath} -o output.out`, (error, stdout, stderr) => {
            error ? reject(error) : (stdout ? resolve(stdout) : resolve(stderr));
        });
    })
}

const executeCodeAndGenerateOutput = (filePath, executionCommand, inputString, executionOptions = [], ackID) => {
    return new Promise((resolve, reject) => {
        let output = "";
        const child = spawn(executionCommand, [ ...executionOptions, filePath], { detached: true });

        if(inputString[inputString.length-1] !== '\n') inputString += '\n'
        child.stdin.write(inputString);

        child.stdout.on('data', chunk => {
            output += chunk.toString();
        });

        child.stderr.on('data', chunk => {
            reject(chunk.toString());
        });

        child.on("exit", (exitCode) => {
            resolve({ exitCode, output });
        });

        setTimeout(() => {
            if( global.ackIdToMap.get(ackID) && !global.ackIdToMap.get(ackID).isExecuted) {
                let processKilled = process.kill(-child.pid);
                if (processKilled) resolve({exitCode: -11111, "output": "Process killed, due to time-limit exceed"});
                else {
                    console.log("Problem with code");
                    process.exit(0);
                }
            }
        }, timeoutTime);
    })
}

module.exports = { executeCodeAndGenerateOutput, generateExecutableForCCpp }