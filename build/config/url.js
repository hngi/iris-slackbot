"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv").config(); //require env constiables to make file independent
var dbUser = process.env.DB_USER;
var dbPassword = process.env.DB_PASSWORD;
var dbBase = process.env.DB_BASE;
var mongoURI = process.env.MONGODB_URI;
var mongoURI_DEV = process.env.DB_URI;
var dbName = process.env.DB_NAME;
exports.connectStrings = {
    development: {
        url: mongoURI_DEV || "mongodb://" + dbUser + ":" + dbPassword + "@localhost/" + dbName,
        port: 5000
    },
    staging: {
        url: mongoURI || "mongodb://" + dbUser + ":" + dbPassword + "@" + dbBase,
        port: 5300
    },
    production: {
        url: mongoURI || "mongodb://" + dbUser + ":" + dbPassword + "@" + dbBase,
        port: 5300
    }
};
