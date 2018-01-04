let peerflix = require("peerflix")
let proc = require("child_process")

function startEngine(uri) {
	return new Promise((resolve, reject) => {
		let engine = peerflix(uri)
		engine.server.on('listening', () => {
			resolve(engine)
		})
	})
}

function openVlc(engine) {
	return new Promise((resolve, reject) => {
		let localHref = `http://localhost:${engine.server.address().port}/`
		let root = '/Applications/VLC.app/Contents/MacOS/VLC'
		let home = (process.env.HOME || '') + root
		let cmd = `vlc ${localHref} || ${root} ${localHref} || ${home} ${localHref}`
		let vlc = proc.exec(cmd , (error, stdout, stderror) => {
			if (error) {
				reject(error)
			} else {
				resolve()
			}
		})
	})
}

module.exports = (uri) => {
	return new Promise((resolve, reject) => {
		startEngine(uri).then(engine => {
			openVlc(engine).then(() => {
				resolve()
			})
		})
	})
}
