const express = require("express");
const cors = require("cors");
const apiRoutes = require("../routes")
const {executeCode} = require("../services");

const server = express();

server.use(cors());
server.use(express.json());
server.use("/api/v1", apiRoutes);

global.queue = [], global.ackIdToMap = new Map();

setInterval(() => executeCode(), 250);

server.listen(process.env.PORT, () => console.log(`Server started at port: ${process.env.PORT}`));
