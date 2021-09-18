const uuid = require("uuidv4");
const { executeCodeAndGenerateOutput, generateExecutableForCCpp} = require("./app/codeExecutor");
const {allErrors} = require("./configs");
const fs = require("fs");

const addCodeToQueue = (code, language, input) => {
    let ackId = uuid.uuid();
    global.queue.push(ackId);
    global.ackIdToMap.set(ackId, {
        code, language, input, output: "", isExecuted: false
    })
    return {
        "ackID": ackId,
        "status": "Code successfully enqueued to queue"
    }
}

const writeFileUtil = (code, fileName) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, code, 'utf8', (err) => {
            err ? reject(err) : resolve();
        })
    })
}

const checkStatus = ackId => {
    if (!global.ackIdToMap.get(ackId)) return allErrors.invalidAcknowledgementID;
    else if (!global.ackIdToMap.get(ackId).isExecuted) {
        return {
            "status": "in queue...",
        }
    } else {
        let executionResult = global.ackIdToMap.get(ackId);
        global.ackIdToMap.delete(ackId);
        return {
            "status": "executed",
            "input": executionResult.input,
            "result": executionResult.output
        }
    }
}

const executeCode = async() => {
    let element = global.queue.shift();
    if(!element) return;
    try {
        let { code, language, input } = global.ackIdToMap.get(element);
        switch(language) {
            case "js": {
                try {
                    let filePath = `${__dirname}/codeFile.js`;
                    await writeFileUtil(code, filePath);
                    global.ackIdToMap.get(element).output = await executeCodeAndGenerateOutput(filePath, "node", input, [], element);
                } catch(err) {
                    console.log(err);
                    global.ackIdToMap.get(element).output = { "exitCode": "N/A", "output": "Please try again later" }
                }
                break;
            }
            case "go": {
                try {
                    let filePath = `${__dirname}/codeFile.go`;
                    await writeFileUtil(code, filePath);
                    global.ackIdToMap.get(element).output = await executeCodeAndGenerateOutput(filePath, "go", input, [ "run" ], element);
                } catch(err) {
                    console.log(err);
                    global.ackIdToMap.get(element).output = { "exitCode": "N/A", "output": "Please try again later" }
                }
                break;
            }
            case "python3": {
                try {
                    let filePath = `${__dirname}/codeFile.py`;
                    await writeFileUtil(code, filePath);
                    global.ackIdToMap.get(element).output = await executeCodeAndGenerateOutput(filePath, "python3", input, [], element);
                } catch(err) {
                    console.log(err);
                    global.ackIdToMap.get(element).output = { "exitCode": "N/A", "output": "Please try again later" }
                }
                break;
            }
            case "c/c++": {
                try {
                    let filePath = `${__dirname}/codeFile.cpp`, executablePath = `${__dirname}/output.out`;
                    await writeFileUtil(code, filePath);
                    await generateExecutableForCCpp(filePath, "g++");
                    global.ackIdToMap.get(element).output = await executeCodeAndGenerateOutput("", "./output.out", input, [], element);
                } catch(err) {
                    console.log(err);
                    global.ackIdToMap.get(element).output = { "exitCode": "N/A", "output": err.message }
                }
                break;
            }
            default: {
                console.log("Language not supported");
            }
        }
        global.ackIdToMap.get(element).isExecuted = true;
    } catch(err) {
        console.error(err);
    }

}

module.exports = { addCodeToQueue, executeCode, checkStatus }