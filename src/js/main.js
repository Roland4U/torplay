let Vue = require('vue/dist/vue.min.js')
let search = require('./js/search.js')
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
		ready: false,
		error: false,
		more: false
	},
	mounted(){
		command((err, cmd) => {
			if(err){
				this.novlc = true
			}
			else {
				this.search()
			}
			this.ready = true
		})
	},
	methods: {
		submit(e){
			this.more = false
			this.page = 0
			this.files = []
			this.search()
			e.preventDefault()
		},
		search(){
			this.showLoading()
			search(this.query, this.page).then(results => {
				this.files = this.files.concat(results)
				this.error = false
				this.hideLoading()
				getMoreBtn()
			})
			.catch(err => {
				this.error = true
				this.hideLoading()
				getMoreBtn()
			})
			let getMoreBtn = () => {
				this.$nextTick(() => {
					if(document.body.scrollHeight > innerHeight){
						this.more = true
					}
				})
			}
		},
		play(magnet){
			this.showLoading()
			play(magnet).then(() => {
				this.hideLoading()
			})
		},
		loadMore(){
			this.page++
			this.search()
		},
		hideLoading(){
			this.loading = false
			document.body.style['overflow-y'] = 'visible'
		},
		showLoading(){
			this.loading = true
			document.body.style['overflow-y'] = 'hidden'
		}
	}
})
