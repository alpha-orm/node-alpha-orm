const { AlphaORM } = require('../index')

/**
Implemented for:
-mysql [completed]
-sqlite [completed]
-postgres [completed]
-sqlserver [undone]
*/


/**
---------------------------------------
CREATE
---------------------------------------
*/
async function create() {
    product = await AlphaORM.create('shop_product')
    product.name = "Running Shoes"
    product.price = 1000
    product.stock = 50
    await AlphaORM.store(product)
}




/**
---------------------------------------
CREATE 2
---------------------------------------
*/
async function create_2() {
    author = await AlphaORM.create('author')
    author.name = 'Chimamanda Adichie'

    book = await AlphaORM.create('book')
    book.title = 'Purple Hibiscus'
    book.author = author
    await AlphaORM.store(book)
}




/**
---------------------------------------
READ [get all records]
---------------------------------------
*/
async function read() {
    books = await AlphaORM.getAll('book')
    books.forEach((book)=>{
        console.log(`${book.title} by ${book.author.name}`)
    })
}




/**
---------------------------------------
READ 2 [filter one]
---------------------------------------
*/
async function read_2() {
    book = await AlphaORM.find('book','id = :bid', { 'bid' : 1 })
    console.log(`${book.title} by ${book.author.name}`)
}




/**
---------------------------------------
READ 3 [filter all]
---------------------------------------
*/
async function read_3() {
    author = await AlphaORM.find('author','name = :author_name',{ 'author_name': 'William Shakespare' })
    booksByShakespare = await AlphaORM.findAll('book', 'author_id : a_id', { 'a_id': author.getID() })
    console.log('Books by William Shakespare are :')
    booksByShakespare.forEach((book) => {
        console.log(book.title)
    })
}




/**
---------------------------------------
UPDATE
---------------------------------------
*/
async function update() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 1 })
    product.price = 500

    book = await AlphaORM.find('book','id = :bid', { 'bid' : 1 })
    book.author.name = 'New author'
    book.author.isbn = '3847302-SD'
    book.title = 'New Title'
    await AlphaORM.store(book)
}




/**
---------------------------------------
DELETE 1 [delete single record]
---------------------------------------
*/
async function del() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 1 })
    await AlphaORM.drop(product)
}



/**
---------------------------------------
DELETE 2 [delete all records]
---------------------------------------
*/
async function del_2() {
    await AlphaORM.dropAll('shop_product')
}


module.exports = { create, create_2, reading, read_2, read_3, update, del, del_2 }