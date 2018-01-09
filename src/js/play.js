let peerflix = require('peerflix')
let cp = require('child_process')
let command = require('vlc-command')

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
		command((err, cmd) => {
			if(err){
				reject(err)
			}
			else {
				if(process.platform === 'win32') {
					cp.execFile(cmd, [localHref], (err, stdout) => {
						if (err) {
							reject(err)
						} else {
							resolve()
						}
					})
				}
				else {
					cp.exec(`${cmd} ${localHref}`, (err, stdout) => {
						if (err) {
							reject(err)
						} else {
							resolve()
						}
					})
				}
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
