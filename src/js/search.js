let axios = require('axios')
let cheerio = require('cheerio')
let {URL} = require('url')

module.exports = function(query, page){
	return new Promise((resolve, reject) => {
		let url = new URL(query ? `https://thepiratebay.org/search/${query}/${page}/99/100,200,500` : 'https://thepiratebay.org/top/48h200')
		axios.get(url)
		.then(result => {
			let $ = cheerio.load(result.data)
			let files = $('#searchResult tr:not(.header)').map(function(){
				let desc = $(this).find('font').text().split(', ')
				let name = $(this).find('a.detLink').text()
				let uploadDate = desc[0].replace(/[a-z\s]+(.+)/i, '$1')
				let size = desc[1].replace(/[a-z\s]+(.+)/i, '$1')
				let seeders = $(this).find('td[align="right"]').first().text()
				let leechers = $(this).find('td[align="right"]').next().text()
				let magnetLink = $($(this).find('a')[3]).attr('href')
				let uploader = $(this).find('font .detDesc').text() || 'Anonymous'
				let category = $(this).find('center a').first().text()
				let subcategory = $(this).find('center a').last().text()
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
		})
		.catch(err => {
			reject(err)
		})
	})
}
