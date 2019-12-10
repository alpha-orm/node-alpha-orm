const { AlphaORM: DB } = require('../index')

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
    product = await DB.create('shop_product')
    product.name = "Running Shoes"
    product.price = 1000
    product.stock = 50
    await DB.store(product)
    console.log(product.getID())
}




/**
---------------------------------------
CREATE 2
---------------------------------------
*/
async function create_2() {
    author = await DB.create('author')
    author.name = 'Chimamanda Adichie'

    book = await DB.create('book')
    book.title = 'Purple Hibiscus'
    book.author = author
    await DB.store(book)
}




/**
---------------------------------------
READ [get all records]
---------------------------------------
*/
async function read() {
    books = await DB.getAll('book')
    books.forEach((book) => {
        console.log(`${book.title} by ${book.author.name}`)
    })
}




/**
---------------------------------------
READ 2 [filter one]
---------------------------------------
*/
async function read_2() {
    book = await DB.find('book', 'id = :bid', { 'bid': 1 })
    console.log(`${book.title} by ${book.author.name}`)
}




/**
---------------------------------------
READ 3 [filter all]
---------------------------------------
*/
async function read_3() {
    author = await DB.find('author', 'name = :authorName', { 'authorName': 'William Shakespare' })
    booksByShakespare = await DB.findAll('book', 'author_id : aId', { 'aId': author.getID() })
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
    product = await DB.find('shop_product', 'id = :id', { id: 1 })
    product.price = 500

    book = await DB.find('book', 'id = :bid', { 'bid': 1 })
    book.author.name = 'New author'
    book.author.isbn = '3847302-SD'
    book.title = 'New Title'
    await DB.store(book)
}




/**
---------------------------------------
DELETE 1 [delete single record]
---------------------------------------
*/
async function del() {
    product = await DB.find('shop_product', 'id = :id', { id: 1 })
    await DB.drop(product)
}



/**
---------------------------------------
DELETE 2 [delete all records]
---------------------------------------
*/
async function del_2() {
    await DB.dropAll('shop_product')
}


module.exports = { create, create_2, read, read_2, read_3, update, del, del_2 }