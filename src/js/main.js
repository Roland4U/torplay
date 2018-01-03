let Vue = require('vue/dist/vue.min.js')
let PirateBay = require('thepiratebay')
let WebTorrent = require('webtorrent')
let mime = require('mime')
let client

let vm = new Vue({
	el: '#app',
	data: {
		files: [],
		page: 0,
		query: '',
		section: 'home',
		loading: false
	},
	methods: {
		submit(e){
			this.page = 0
			this.files = []
			this.search()
			e.preventDefault()
		},
		search(){
			this.loading = true
			PirateBay.search(this.query, {category: 'video', page: this.page}).then(results => {
				this.files = this.files.concat(results)
				this.section = 'search'
				this.loading = false
			}).catch(err => {
				alert(err.toString())
				this.loading = false
			})
		},
		more(){
			this.page++
			this.search()
		},
		play(magnet){
			client = new WebTorrent()
			this.section = 'player'
			this.loading = true
			client.add(magnet, torrent => {
				let file = torrent.files.find(file => {
					return /^\w+\/(mp4|webm|ogg)$/.test(mime.getType(file.name))
				})
				if(file){
					this.loading = false
					file.appendTo('#player')
				}
				else {
					this.close()
				}
			})
		},
		close(){
			this.loading = true
			client.destroy(err => {
				this.loading = false
				if(err) {
					alert(err.toString())
				}
				else {
					this.section = 'search'
				}
			})
		},
		goHome(){
			this.query = ''
			this.section = 'home'
		}
	}
})
