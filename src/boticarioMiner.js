const requestPromise = require('request-promise')
const cheerio = require('cheerio')
const urls = require('./assets/boticarioUrls.json')

async function scrapeAllDataFromBoticarioWebSite(){

    const products = []

    for (index in urls){
        const html = await scrapeHtmlFromBoticarioWebSite( urls[index] )
        const productsContainer = breakContentFromHtml( html )
        const productsScraped = scrapeDataOfAllProductsContainers( productsContainer )
        productsScraped.forEach(item => {
            products.push(item)
        })
    }

    return products

    async function scrapeHtmlFromBoticarioWebSite( url ){

        function onRequestSuccessed( response ){
            console.log('request successed ...')
            const $ = cheerio.load( response )
            return $
        }

        function onRequestError( error ){
            console.log('error ...' + err)
            return []
        }

        return await requestPromise(url)
            .then( onRequestSuccessed )
            .catch( onRequestError )
    }

    function breakContentFromHtml( $ ){
        const productsContainer = $('.offer-inner')
        return productsContainer
    }

    function scrapeDataOfAllProductsContainers( productsContainer ){
        const products = []

        for(let i = 0; i<productsContainer.length; i++){
          products.push( scrapeDataOfOneContainer(productsContainer[i]) )
        }

        return products;
    }

    function scrapeDataOfOneContainer( productContainer ){
        let product = {}
        product.image = scrapeImage(productContainer)
        product.name = scrapeName(productContainer)
        product.price = scrapePrice(productContainer)
        return product
    }
      
    function scrapeImage( container ){
        const $ = cheerio.load(container)
        return $('img').attr('src')
    }
    
    function scrapeName( container ){
        const $ = cheerio.load(container)
        return $('.shelf-product-name a').attr('title')
    }
    
    function scrapePrice( container ){
        const $ = cheerio.load(container)
        return $('.shelf-product-price').text()
    }

}

module.exports = { scrapeAllDataFromBoticarioWebSite }