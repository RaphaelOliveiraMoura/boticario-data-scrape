const requestPromise = require('request-promise')
const cheerio = require('cheerio')
const urls = require('./urls.json').urls
const fileSystem = require('fs');

async function run(){
  let allData = []

  for (i in urls){
    console.log( `${i}/${urls.length}` )
    let products = await scrap( urls[i] )
    products.forEach((item)=>{ allData.push(item) })
  }

  saveDataInJSONFile( allData, () => {
      console.log( `finish ${allData.length} data saved` )
      const productsJSON = fileSystem.readFileSync('src/products.json')
      const cleanedData = clearRepeatDataInJSONFile( JSON.parse(productsJSON) )
      console.log('cleaned data size', cleanedData.length)
      saveDataInJSONFile(cleanedData , () => {
        console.log(`${allData.length - cleanedData.length} data cleaned`)
      } )
  } )
  
}

async function scrap( url, callback ){
  console.log('starting ...')
  return await requestPromise(url)
    .then(function(html){
      console.log('request successed ...')

      const $ = cheerio.load(html)
      const productsContainer = $('.offer-inner')
      return scrapeDataOfAllContainers(productsContainer)
    })
    .catch(function(err){
      console.log('error ...' + err)
      return []
    })
}

function scrapeDataOfAllContainers( productsContainer ){
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

function saveDataInJSONFile( data, callback ){
  fileSystem.writeFile('src/products.json', JSON.stringify(data, null, 2), 'utf8', callback);
}

function clearRepeatDataInJSONFile( data ){
  return data.filter(function(index, item) {
    return true;
  })


}

run()