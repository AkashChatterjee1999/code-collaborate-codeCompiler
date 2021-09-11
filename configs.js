module.exports = {
    supportedLanguages: [ "js", "python3", "go", "c/c++" ],
    allErrors: {
        "invalidLanguage": {
            errorCode: "invalidLanguage",
            errorDescription: "The code language selected is invalid/ not supported"
        },
        "noCodeFound": {
            errorCode: "noCodeFound",
            errorDescription: "You need to specify the code in request body to make it compile"
        },
        "invalidAcknowledgementID": {
            errorCode: "invalidAcknowledgementID",
            errorDescription: "The acknowledgement id provided is invalid"
        }
    },
    timeoutTime: 5000,
}