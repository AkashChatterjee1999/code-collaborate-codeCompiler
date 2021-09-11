const express = require("express");
const router = express.Router();

const { supportedLanguages, allErrors, input } = require("./configs");
const {addCodeToQueue, checkStatus} = require("./services");

router.post("/submitCode", async(req, res) => {
    if(!req.body) {
        res.status(400);
        res.send(allErrors.invalidLanguage);
    } else if(!req.body.language || !supportedLanguages.includes(req.body.language)) {
        res.status(400);
        res.send(allErrors.invalidLanguage);
    } else if(!req.body.code || req.body.code.trim().length === 0) {
        res.status(400);
        res.send(allErrors.noCodeFound);
    } else {
        let { code, language, input } = req.body;
        let response = addCodeToQueue(code, language, input ? input : "");
        res.status(200);
        res.send(response);
    }
})

router.get("/checkStatus/:ackId", async(req, res) => {
    let ackId = req.params.ackId;
    if(!ackId || ackId.trim().length === 0) {
        res.status(400);
        res.send(allErrors.invalidAcknowledgementID);
    } else {
        let response = checkStatus(ackId);
        if(response.errorCode) {
            res.status(400);
            res.send(response);
        } else {
            res.status(200);
            res.send(response);
        }
    }
})

module.exports = router;