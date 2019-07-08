/*****************************************************
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*****************************************************/

const express = require("express")
const path = require("path")
const fs = require("fs")
const url = require("url")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const cadbah = require(path.join(__dirname, "server", "CADbah.js"))

// Command line arguments
var roothtml=process.argv[2]
if (typeof roothtml=="undefined"){roothtml="CADbah.html"}
console.log("Serving ", roothtml)

// Express
const app = express()
if (typeof global.appRoot=="undefined") {global.appRoot=path.resolve(__dirname)}
if (typeof global.uploads_dir=="undefined") {global.uploads_dir="uploads"}

// Main entry 
app.get('/', function (req, res) {res.sendFile(path.join(__dirname, roothtml));})

// Logger
app.use(function(req, res, next){console.log("LOG...",req.url);	next();});

// File server
// root
app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname, "dist")))
app.use(express.static(path.join(__dirname, "resources")))
app.use(express.static(path.join(__dirname, "resources", "images")))
app.use(express.static(path.join(__dirname, "resources", "skyboxes")))
app.use(express.static(path.join(__dirname, "node_modules","babylonjs")))
app.use(express.static(path.join(__dirname, "node_modules","jquery","dist")))
app.use(express.static( path.join(__dirname, "node_modules","jquery-ui-dist")))
app.use(express.static(path.join(__dirname, "node_modules/jquery-ui-dist/external/jquery")))
app.use(express.static(path.join(__dirname, "node_modules","jquery-ui-dist","images")))


if (__dirname!=global.appRoot) {app.use(express.static(global.appRoot))}


// Middleware parsers for database queries and uploads
app.use( bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 10000}));
app.use( bodyParser.json({limit: '50mb'}));

// Uploader
app.use(fileUpload({limits: { fileSize: 50 * 1024 * 1024 }}));

// Server Filesystem Routes 
app.post("/uploads", cadbah.handler);

// Start serving...
app.listen(8080, function () {console.log("Port     http://localhost:8080/")});


