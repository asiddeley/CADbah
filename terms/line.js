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
const pointer=require('../terms/pointer.js')

terms.addTerm(new terms.createTerm({
	name:'line', 
	about:'adds a line to the drawing',
	action:function(u,v,x,y){
		CAD.prompt('u,v,x,y OR [enter] for pointer...', function(response){
			//CAD.msg('Coords', response||'nothing entered')
			
			
			
		})
		u=u||0; v=v||0; x=x||100; y=y||100
		var path = new Path();
		// Give the stroke a color
		path.strokeColor = 'black';
		var start = new Point(u, v);
		// Move to start and draw a line from there
		path.moveTo(start);
		// Note the plus operator on Point objects.
		// PaperScript does that for us, and much more!
		//path.lineTo(start + [ 100, -50 ]);
		path.lineTo(x,y)
		view.draw()
	},
	alias:'ln',
	topic:'entities', 
	terms:['[x0, y0], [x1, y1]']
}))




// PUBLIC



