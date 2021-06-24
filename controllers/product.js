//File: controllers/product.js

const axios = require('axios');
const logger = require('../utils/logger');
const url = "http://www.mocky.io/v2/5e307edf3200005d00858b49";

exports.findProductsWithFilter = function(req, res) {

	var maxPrice =  req.query.maxprice ? req.query.maxprice : 0 ;
	var size = req.query.size ? req.query.size : '';
	var highlight = req.query.highlight ? req.query.highlight.split(',') : [];

	axios.get(url)
	.then(({ data }) => {

		logger.info(`mocky.io response: ${JSON.stringify(data)}`)

		var response = {};
		var productsFiltered = Object.values(data.products).filter(product => (product.price <= maxPrice || maxPrice == 0) && (product.sizes.includes(size) || size == ''))		
		var descriptions = "";

		response.maxPrice = productsFiltered.reduce((p, c) => p.price > c.price ? p : c).price;
		response.minPrice = productsFiltered.reduce((p, c) => p.price < c.price ? p : c).price;
		response.allSizes = [...new Set(productsFiltered.flatMap(x => x.sizes).flat(2))];

		productsFiltered.forEach(item => {
			descriptions += " " + item.description.toLowerCase();
		});	

		response.commonWords = filterCommonWords(getCommondWords(descriptions));		                           
	
		productsFiltered.forEach(item => {
			highlight.forEach( highlightItem =>{
				item.description = item.description.replace(highlightItem,"<em>" + highlightItem + "</em>");
			});
		});		

		response.products = productsFiltered;
		
		logger.info(`response: ${JSON.stringify(response)}`)
		res.status(200).jsonp(response);

	})
	.catch(error=>{
		res.status(500).jsonp(error);
		logger.error(`mocky.io: ${JSON.stringify(error)}`)
	});
}

function getCommondWords(allDescriptions) {

	var wordCounts = {};
	var words = allDescriptions.split(/\b/);
	var exclude = [" ", "<", ">", "em", "</", ".", ""]

	words.forEach(word => {
		if (!exclude.includes(word.split(" ").join(""))) {
			wordCounts[word.toLowerCase()] = (wordCounts[word.toLowerCase()] || 0) + 1;
		}
	});

	return wordCounts;
}

filterCommonWords = function(wordCounts) {
	var objSorted = {};	
	var sortable = [];

	for (var item in wordCounts) {
		sortable.push([item, wordCounts[item]]);
	}

	sortable.sort(function(a, b) {
		return b[1] - a[1];
	});

	sortable.splice(0,5);
	sortable.splice(9,sortable.length - 10);

	sortable.forEach(function(item){
		objSorted[item[0]]=item[1]
	})

	return objSorted;
}