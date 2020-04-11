/**********************************
CADBAH* *Contract Admin Site Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
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
**/

const PATH=require('path')
const APP=require('electron').app
//const WM=require(PATH.join(__dirname, 'electron', 'windowMaster.js'))
const WM=require('electron-window-manager')
const OPTIONS={
	width: 1000,
	height: 500,
	//position: 'topLeft',
	position:[20, 20],
	resizable:true,
	showDevTools:true,
	frame:true,
	webPreferences: {nodeIntegration: true}
}

function cascade(offset){
	offset=offset||[10, 10]
	return OPTIONS.position.map(function(v,i){v+offset[i]})	
}


//APP.commandLine.appendSwitch('--enable-logging')

APP.on('ready', function(){
	console.log('Electron App Ready...')
	//WM.open('CAD.html')
	//open( name, title, url, setupTemplate, setup, showDevTools )
	WM.open(
		'main', 
		'CadBah - Main', 
		`file://${__dirname}/electron/CAD.html`, 
		false, 
		OPTIONS
	)

	WM.open(
		'tilemenu', 
		'CadBah - TileMenu', 
		`file://${__dirname}/electron/tilemenu.html`, 
		false, 
		Object.assign(OPTIONS, {
			width:(96 * 3) + 16,
			height:(96 * 3) + 192 + 32 + 16,
			position:cascade(20, 20),
			showDevTools:false
		})
	)
	
	
	
	//WM.open('CAD.html')
})




