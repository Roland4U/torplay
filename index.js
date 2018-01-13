let {app, BrowserWindow} = require('electron')
let path = require('path')
let url = require('url')

app.on('ready', () => {

	let win = new BrowserWindow({
		width: 640,
		height: 480,
		minWidth: 640,
		minHeight: 480,
		center: true,
		icon: path.join(__dirname, 'assets', 'icon.png'),
		backgroundColor: '#000',
		resizable: false,
		title: 'Play Torrent'
	})

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'src', 'index.html'),
		slashes: true,
		protocol: 'file'
	}))

})

app.on('window-all-closed', () => {
	app.quit()
})
