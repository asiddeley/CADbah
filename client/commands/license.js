/***
CADbah
Copyright (c) 2019 Andrew Siddeley
MIT License
***/
// PRIVATE

// multi-line text encapsulated in a function's comment...
var html=function(){/*
<h3>License</h3>

[C]omputer<br>
[A]ided<br>
[D]esign<br>
[B]e<br>
[A]rchitectural<br>
[H]eroes<br>
Copyright (c) 2018, 2019 Andrew Siddeley<br><br>

MIT License:<br><br>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:<br><br>

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.<br><br>

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.<hr>
*/}.toString().replace("function(){/*","").replace("*/}","");


// MIXINS
$.extend(exports, require("../command"));

// PUBLIC
// required funcitons for command modules
exports.allowed=["cadbah", "caddeley"];
exports.name="license";
exports.help=function(CAD){return html;};
exports.action=function(CAD, argstr){CAD.msg(html);};


