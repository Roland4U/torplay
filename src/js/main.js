const Vue = require('vue/dist/vue.min.js')
const search = require('./js/search.js')
const play = require('./js/play.js')
const command = require('vlc-command')
const { dialog } = require('electron').remote
const os = require('os')
let bg

const vm = new Vue({
	el: '#app',
	data: {
		files: [],
		page: 0,
		query: '',
		novlc: false,
		loading: false,
		ready: false,
		error: false,
		more: false,
		settings: false,
		downloads: null,
		categories: null,
		top: null,
		theme: {}
	},
	mounted() {
		bg = document.querySelector('.bg')
		const defaultTheme = {
			bg: '#000000',
			fg: '#FFFFFF',
			topbarbg: '#008888',
			topbarfg: '#FFFFFF',
			btnbg: '#333333',
			btnfg: '#FFFFFF',
			btnborder: '#333333',
			inputbg: '#FFFFFF',
			inputfg: '#000000',
			inputborder: '#FFFFFF',
			labels: '#008888',
			links: '#00FFFF',
			loading: '#00FFFF'
		}

		this.downloads = localStorage.downloads || os.tmpdir()
		this.categories = localStorage.categories ? JSON.parse(localStorage.categories) : ['100', '200', '500']
		this.top = localStorage.top || '200'
		this.theme = localStorage.theme ? JSON.parse(localStorage.theme) : defaultTheme

		command((err, cmd) => {
			this.ready = true
			this.$nextTick
			if (err) {
				this.novlc = true
			}
			else {
				this.search()
			}
		})
	},
	methods: {
		submit(e) {
			if (/^magnet:\?xt=urn:btih:/.test(this.query)) {
				this.play(this.query)
			}
			else {
				this.more = false
				this.page = 0
				this.files = []
				this.search()
			}
			e.preventDefault()
		},
		search() {
			this.showLoading()
			search(this.query, this.page).then(results => {
				this.files = this.files.concat(results)
				this.error = false
				getMoreBtn()
				this.hideLoading()
			})
				.catch(err => {
					this.error = true
					getMoreBtn()
					this.hideLoading()
				})
			const getMoreBtn = () => {
				this.$nextTick(() => {
					if (bg.scrollHeight > bg.offsetHeight && this.query) {
						this.more = true
					}
				})
			}
		},
		play(magnet) {
			this.showLoading()
			play(magnet).then(() => {
				this.hideLoading()
			})
		},
		loadMore() {
			this.page++
			this.search()
		},
		hideLoading() {
			this.loading = false
			bg.style['overflow-y'] = 'visible'
		},
		showLoading() {
			this.loading = true
			bg.style['overflow-y'] = 'hidden'
		},
		selectDownloads() {
			dialog.showOpenDialog({
				defaultPath: os.homedir(),
				properties: ['openDirectory']
			}, dir => {
				this.downloads = localStorage.downloads = dir[0]
			})
		},
		setTheme() {
			localStorage.theme = JSON.stringify(this.theme)
		}
	},
	computed: {
		appStyle() {
			return {
				backgroundColor: this.theme.bg,
				color: this.theme.fg
			}
		},
		topbarStyle() {
			return {
				backgroundColor: this.theme.topbarbg,
				color: this.theme.topbarfg,
			}
		},
		inputStyle() {
			return {
				backgroundColor: this.theme.inputbg,
				color: this.theme.inputfg,
				borderColor: this.theme.inputborder
			}
		},
		btnStyle() {
			return {
				backgroundColor: this.theme.btnbg,
				color: this.theme.btnfg,
				borderColor: this.theme.btnborder
			}
		},
		labelsStyle() {
			return {
				color: this.theme.labels
			}
		},
		linkStyle() {
			return {
				color: this.theme.links
			}
		},
		loadingStyle() {
			return {
				borderRightColor: this.theme.loading,
				borderLeftColor: this.theme.loading
			}
		},
		btnColorStyle() {
			return {
				borderColor: this.theme.fg
			}
		},
		fieldsetStyle() {
			return {
				borderColor: this.theme.fg
			}
		}
	},
	watch: {
		categories(v) {
			localStorage.categories = JSON.stringify(v)
		},
		top(v) {
			localStorage.top = v
		}
	}
})
