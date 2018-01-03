let {app, BrowserWindow} = require('electron')
let path = require('path')
let url = require('url')

app.on('ready', () => {

	let win = new BrowserWindow({
		width: 800,
		height: 600,
		center: true,
		icon: path.join(__dirname, 'icon.png')
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
