# alpha-orm
An extraordinary javascript database orm

## Features
* Automatically creates tables and columns.
* No configuration required, simply create database.
* Currently supported databases include mysql and sqlite.


## Examples
#
### Setup (MySQL)
```javascript
const { AlphaORM  } = require('alpha-orm')

AlphaORM.setup('mysql',{
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'alphaorm'
})
```

### Setup (SQLite)
```javascript
const { AlphaORM  } = require('alpha-orm')

AlphaORM.setup('sqlite',{
  database : 'alphaorm'
})
```
#
#
### Creating
```javascript
/**
* creating
*/
product = await AlphaORM.create('shop_product')
product.name = "Running Shoes" 
product.price = 1000
product.stock = 50
await AlphaORM.store(product)


/**
* creating [foreign key]
*/
user = await AlphaORM.create('user')
user.firstname = "Claret"
user.lastname = "Nnamocha"
user.age = 21
user.birthday = '8-October-1998'

student = await AlphaORM.create('student')
student.matno = "15/31525"
student.user = user

await AlphaORM.store(student)
```
#
### Reading
```javascript
/**
* reading [one] (filter)
*/
product = await AlphaORM.find('shop_product','id = :id',{ id : 3 })
console.log(product)

/**
* reading [all]
*/
products = await AlphaORM.getAll('shop_product')
console.log(products)


/**
* reading [all] (filter)
*/
products = await AlphaORM.findAll('shop_product','id > 0')
console.log(products)
```
#
### Updating

```javascript
/**
* update
*/
product = await AlphaORM.find('shop_product','id = :id', { id : 3 })
product.price = 500
await AlphaORM.store(product)
```
#
### Delete
```javascript
/**
* delete
*/
product = await AlphaORM.find('shop_product','id = :id', { id : 2 })
await AlphaORM.drop(product)
```