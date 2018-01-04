let Vue = require('vue/dist/vue.min.js')
let PirateBay = require('thepiratebay')
let play = require('./js/play.js')

let vm = new Vue({
	el: '#app',
	data: {
		files: [],
		page: 0,
		query: '',
		section: 'home',
		loading: false,
		lockScroll: false
	},
	mounted(){
		window.document.body.onscroll = () => {
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.section == 'search' && !this.lockScroll) {
				this.page++
				this.lockScroll = true
				this.search()
			}
		}
	},
	methods: {
		submit(e){
			this.page = 0
			this.files = []
			this.search()
			e.preventDefault()
		},
		search(){
			this.showLoading()
			PirateBay.search(this.query, {category: [100,200,500], page: this.page}).then(results => {
				this.section = 'search'
				this.files = this.files.concat(results)
				this.lockScroll = false
				this.hideLoading()
			}).catch(err => {
				this.lockScroll = false
				this.hideLoading()
			})
		},
		play(magnet){
			this.showLoading()
			play(magnet).then(() => {
				this.hideLoading()
			})
		},
		goHome(){
			this.query = ''
			this.section = 'home'
		},
		showLoading(){
			document.body.style['overflow-y'] = 'hidden'
			this.loading = true
		},
		hideLoading(){
			document.body.style['overflow-y'] = 'auto'
			this.loading = false
		}
	}
})
