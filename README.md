# alpha-orm
An extraordinary javascript database orm

## Features
* Automatically creates tables and columns.
* No configuration required, simply create database.
* Currently supported databases include mysql, sqlite and postgresql.


## Examples
#
### Setup (MySQL)
```javascript
const { AlphaORM: DB  } = require('alpha-orm')

DB.setup('mysql',{
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'alphaorm'
})
```

### Setup (SQLite)
```javascript
const { AlphaORM: DB  } = require('alpha-orm')

DB.setup('sqlite',{
  database : 'alphaorm'
})
```

### Setup (PostgreSQL)
```javascript
const { AlphaORM: DB  } = require('alpha-orm')

DB.setup('pgsql',{
  host     : 'localhost',
  user     : 'postgres',
  password : 'postgres',
  database : 'alphaorm'
})
```
#
#
### CREATE
```javascript
//--------------------------------------
//	CREATE 1
//--------------------------------------
product = await DB.create('product')
product.name = 'Running shoes'
product.price = 5000
await DB.store(product)




//--------------------------------------
//	CREATE 2
//--------------------------------------
author = await DB.create('author')
author.name = 'Chimamanda Adichie'

book = await DB.create('book')
book.title = 'Purple Hibiscus'
book.author = author
await DB.store(book)
```
#
### READ
```javascript
//--------------------------------------
//	READ 1 [get all records]
//--------------------------------------
books = await DB.getAll('book')
for book in books:
	console.log(`${book.title} by ${book.author.name}`)




//--------------------------------------
//	READ 2 [filter one]
//--------------------------------------
book = await DB.find('book','id = :bid', { 'bid' : 1 })
console.log(`${book.title} by ${book.author.name}`)




//--------------------------------------
//	READ 3 [filter all]
//--------------------------------------
author = await DB.find('author','name = :authorName',{ 'authorName': 'William Shakespare' })
booksByShakespare = await DB.findAll('book', 'author_id = :authorId', { 'authorId': author.getID() })
console.log('Books by William Shakespare are :')
for book in booksByShakespare:
	console.log(book.title)
```
#
### UPDATE

```javascript

//--------------------------------------
//	UPDATE
//--------------------------------------
product = await DB.find('product', 'id = :pid', { 'pid': 1 })
product.price = 500

book = await DB.find('book','id = :bid', { 'bid' : 1 })
book.author.name = 'New author'
book.isbn = '3847302-SD'
book.title = 'New Title'
await DB.store(book)
console.log(book)
```
#
### DELETE
```javascript
//--------------------------------------
//	DELETE 1 [delete single record]
//--------------------------------------
book = await DB.find('book','id = :bid', { 'bid' : 1 })
await DB.drop(book)




//--------------------------------------
//	DELETE 2 [delete all records]
//--------------------------------------
await DB.dropAll('book')
```