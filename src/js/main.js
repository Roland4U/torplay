let Vue = require('vue/dist/vue.min.js')
let PirateBay = require('thepiratebay')
let play = require('./js/play.js')
let command = require('vlc-command')

let vm = new Vue({
	el: '#app',
	data: {
		files: [],
		page: 0,
		query: '',
		novlc: false,
		loading: false,
		lockScroll: false,
		ready: false,
		error: false,
	},
	mounted(){
		window.document.body.onscroll = () => {
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !this.lockScroll && !this.novlc && this.query) {
				this.page++
				this.lockScroll = true
				this.search()
			}
		}
		command((err, cmd) => {
			if(err){
				this.novlc = true
			}
			else {
				console.log(cmd)
			}
			this.ready = true
		})
	},
	methods: {
		submit(e){
			if(this.query){
				this.page = 0
				this.files = []
				this.search()
			}
			e.preventDefault()
		},
		search(){
			this.showLoading()
			PirateBay.search(this.query, {category: 'video', page: this.page}).then(results => {
				this.files = this.files.concat(results)
				this.lockScroll = false
				this.error = false
				this.hideLoading()
			}).catch(err => {
				this.lockScroll = false
				this.error = true
				this.hideLoading()
			})
		},
		play(magnet){
			this.showLoading()
			play(magnet).then(() => {
				this.hideLoading()
			})
		},
		showLoading(){
			document.body.style['overflow-y'] = 'hidden'
			this.loading = true
		},
		hideLoading(){
			document.body.style['overflow-y'] = 'visible'
			this.loading = false
		}
	}
})
