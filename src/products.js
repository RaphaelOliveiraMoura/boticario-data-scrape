function getData( container ){
    let currentProduct = {}
    currentProduct.name = getName( container )
    currentProduct.price = getPrice( container )
    currentProduct.image = getImage( container )
    return currentProduct
}

function getName( container ){
    let nameContainer = container.getElementsByClassName('shelf-product-name')[0]
    let nameTitle = nameContainer.getElementsByTagName('a')[0]
    return nameTitle.innerHTML
}

function getPrice( container ){
    let priceContainer = container.getElementsByClassName('shelf-product-price')[0]
    let price = priceContainer.innerText
    if(price.includes('\n')) price = price.split('\n')[1]
    return price
}

function getImage( container ){
    let nameContainer = container.getElementsByClassName('offer__image')[0]
    let nameTitle = nameContainer.getElementsByTagName('img')[0]
    return nameTitle.src
}

let productsContainer = document.getElementsByClassName('offer-inner')
let products = []

for( i in productsContainer ){
    products.push( getData( productsContainer[i] ) )
}
