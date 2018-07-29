const axios = require('axios')
const cheerio = require('cheerio')
const { URL } = require('url')

module.exports = (query, page) => {
	return new Promise((resolve, reject) => {
		const categories = JSON.parse(localStorage.categories)
		const url = new URL(query ? `https://thepiratebay.org/search/${query}/${page}/99/${categories}` : `https://thepiratebay.org/top/${localStorage.top}`)
		axios.get(url).then(result => {
			const $ = cheerio.load(result.data)
			const files = $('#searchResult tr:not(.header)').map(function () {
				const desc = $(this).find('font').text().split(', ')
				const name = $(this).find('a.detLink').text()
				const uploadDate = desc[0].replace(/[a-z-\s]+(.+)/i, '$1')
				const size = desc[1].replace(/[a-z\s]+(.+)/i, '$1')
				const seeders = $(this).find('td[align="right"]').first().text()
				const leechers = $(this).find('td[align="right"]').next().text()
				const magnetLink = $($(this).find('a')[3]).attr('href')
				const uploader = $(this).find('font .detDesc').text() || 'Anonymous'
				const category = $(this).find('center a').first().text()
				const subcategory = $(this).find('center a').last().text()
				return {
					name,
					size,
					seeders,
					leechers,
					uploadDate,
					magnetLink,
					category,
					subcategory,
					uploader
				}
			})
			resolve(files.get())
		}).catch(reject)
	})
}
