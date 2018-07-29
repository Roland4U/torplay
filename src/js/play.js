const peerflix = require('peerflix')
const cp = require('child_process')
const command = require('vlc-command')

const startEngine = uri => {
	return new Promise((resolve, reject) => {
		const engine = peerflix(uri, {
			path: localStorage.downloads
		})
		engine.server.on('listening', () => {
			resolve(engine)
		})
	})
}

const openVlc = engine => {
	return new Promise((resolve, reject) => {
		const localHref = `http://localhost:${engine.server.address().port}/`
		command((err, cmd) => {
			if (err) {
				reject(err)
			}
			else {
				if (process.platform === 'win32') {
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

module.exports = uri => {
	return new Promise((resolve, reject) => {
		startEngine(uri).then(engine => {
			openVlc(engine).then(() => {
				engine.destroy(resolve)
			}).catch(reject)
		}).catch(reject)
	})
}
