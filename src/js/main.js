let Vue = require('vue/dist/vue.min.js')
let PirateBay = require('thepiratebay')
let cp = require('child_process')

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
				this.loading = false
				this.$nextTick(() => {
					alert('Network error!')
				})
			})
		},
		more(){
			this.page++
			this.search()
		},
		play(magnet){
			this.loading = true
			let vlc = cp.spawn('peerflix', [magnet, '--vlc'])
			vlc.on('exit', () => {
				this.loading = false
			})
		},
		goHome(){
			this.query = ''
			this.section = 'home'
		}
	}
})
