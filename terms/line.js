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

// PRIVATE STATIC

const cad=require('../electron/CAD.js')
const terms=require('../terms/terms.js')

const lineTracer=function(path, points){
	points.forEach(function(p, i, all){path.add(p)})
}

terms.addTerm({
	name:'line', 
	about:'adds lines to the drawing',
	action:function(){
		cad.pointer.activate(lineTracer)
		cad.prompt('enter x1, y1, x2, y2 OR point & click...', function(responseText){
			var points=[]
			responseText.split(',').forEach(function(n, i, all){
				if (i%2==1){points.push(new Point(Number(all[i-1]), Number(n)))}
			})
			var path=new Path()
			path.strokeColor = 'black'			
			lineTracer(path, points)
			cad.pointer.standby()	
		})

	},
	alias:'ln',
	topic:'entities', 
	terms:['[x0, y0], [x1, y1]']
})


// PUBLIC



