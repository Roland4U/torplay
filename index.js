let { app, BrowserWindow } = require('electron')
let path = require('path')

app.on('ready', () => {

	let win = new BrowserWindow({
		width: 640,
		height: 480,
		minWidth: 640,
		minHeight: 480,
		center: true,
		icon: path.join(__dirname, 'assets', 'icon.png'),
		resizable: false,
		title: 'Play Torrent',
		show: false
	})

	win.loadFile(path.join(__dirname, 'src', 'index.html'))

	win.on('ready-to-show', () => {
		win.show()
	})
})

app.on('window-all-closed', () => {
	app.quit()
})
