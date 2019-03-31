const fileSystem = require('fs')
const boticarioMiner = require('./boticarioMiner')

async function execute() {

  const products = await boticarioMiner.scrapeAllDataFromBoticarioWebSite()
  saveDataInJSONFile(products, () => {
    console.log('products saved!')
  })

  function saveDataInJSONFile( data, callback ){
    fileSystem.writeFile('src/assets/boticarioProducts.json', JSON.stringify(data, null, 2), 'utf8', callback);
  }

}

execute()
