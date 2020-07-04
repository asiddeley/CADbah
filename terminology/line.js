/*****************************************************
CADbah
Computer Aided Design Be Architectural Heroes
Copyright (c) 2019, 2020 Andrew Siddeley

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


//const cad=require("../electron/CAD.js")
const CT=require("../terminology/cadTerminology.js")
const line=require("../drawing/entity-line.js")

const undoer=function(id){}

CT.define({
	name:"line", 
	alias:"ln",
	about:"adds lines to the drawing",
	topic:"entities",
	action:action,
	inputs:[
		{name:"success", type:"function", optional:true, remark:"success callback"},
		{name:"failure", type:"function", optional:true, remark:"failure callback"}
	]
})

function parsePoints(coords){
	return coords.split(",").reduce(function(r,v,i,all){
		if(i%2==1){
			r.push(new Point(Number(v), Number(all[i-1])))
		}
		return r		
	},[])
}

function action(success, failure){
	//success (result)=>{WM.sharedData.set("x-submit-response", {success:true, result:result...})}
	
	_success=success||_success
	_failure=failure||_failure

	cad.prompt("Coordinates | Pointer | Random | eXit", function(entered){
		entered=entered||""
		switch (entered.toUpperCase()){
			case "C":
			case "COORD":
			case "COORDINATES":
				cad.prompt("x1, y1, x2, y2... OK", function(coords){
					line.create({points:parsePoints(coords)})
					success("lines created")
					action()
				})
				break
			case "P":
			case "POINTER":
				cad.pointer.activate({trace:line.trace})
				//console.log("line tool...")
				cad.prompt("point & click, press OK when done...", function(text, done){
					line.create({points:cad.pointer.getPoints()})
					cad.pointer.standby(success)
					done()
					action()
				}, "hold")
				break
			case "R":
			case "RANDOM":		
				cad.prompt("Quantity", function(q){
					q=q||"0"; q=Number(q)
					var i, p, w=view.size.width, h=view.size.height, r=Math.random
					for (i=0; i<q; i++){
						p=new Path.Line(w*r(), h*r(), w*r(), h*r())
						p.strokeColor="black"
					}
					action()
				})
				break
			case "X":
			case "EXIT":_success("line done"); break
			default: _failure("input not recognized: "+entered)		
		}
	})	
}

