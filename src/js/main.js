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
			this.ready = true
		})
	},
	methods: {
		submit(e){
			if(this.query){
				this.more = false
				this.page = 0
				this.files = []
				this.search()
			}
			e.preventDefault()
		},
		search(){
			this.loading = true
			search(this.query, this.page).then(results => {
				this.files = this.files.concat(results)
				this.error = false
				this.loading = false
				getMoreBtn()
			})
			.catch(err => {
				this.error = true
				this.loading = false
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
			this.loading = true
			play(magnet).then(() => {
				this.loading = false
			})
		},
		loadMore(){
			this.page++
			this.search()
		}
	}
})
