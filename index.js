let {app, BrowserWindow} = require('electron')
let path = require('path')
let url = require('url')

app.on('ready', () => {

	let win = new BrowserWindow({
		width: 640,
		height: 480,
		center: true,
		icon: path.join(__dirname, 'assets', 'icon.png'),
		backgroundColor: '#000',
		title: 'Play Torrent',
		resizable: false
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
