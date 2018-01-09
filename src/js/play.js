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
		let vlc = proc.exec(`vlc ${localHref}` , (error, stdout, stderror) => {
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
				engine.destroy(() => {
					resolve()
				})
			})
		})
	})
}
