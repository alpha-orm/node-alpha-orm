const { AlphaORM } = require('../index')

AlphaORM.setup('mysql', {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alphaorm'
})


/**
 * creating
 */
async function creating() {
    product = await AlphaORM.create('shop_product')
    product.name = "Running Shoes"
    product.price = 1000
    product.stock = 50
    await AlphaORM.store(product)
}
creating()


/**
 * creating [foreign key]
 */
async function creating_2() {
    user = await AlphaORM.create('user')
    user.firstname = "Claret"
    user.lastname = "Nnamocha"
    user.age = 21
    user.birthday = '8-October-1998'

    student = await AlphaORM.create('student')
    student.matno = "15/31525"
    student.user = user

    await AlphaORM.store(student)
}
// creating_2()


/**
 * reading [one] (filter)
 */
async function reading() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 3 })
    console.log(product)
}
// reading()


/**
 * reading [all]
 */
async function reading_2() {
    products = await AlphaORM.getAll('shop_product')
    console.log(products)
}
// reading_2()


/**
 * reading [all] (filter)
 */
async function reading_3() {
    products = await AlphaORM.findAll('shop_product', 'id > 0')
    console.log(products)
}
// reading_3()


/**
 * update
 */
async function update() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 3 })
    product.price = 500
    await AlphaORM.store(product)
}
// update()


/**
 * delete
 */
async function del() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 2 })
    await AlphaORM.drop(product)
}
// del()