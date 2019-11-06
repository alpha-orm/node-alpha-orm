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
async function test_1() {
    product = await AlphaORM.create('shop_product')
    product.name = "Running Shoes"
    product.price = 1000
    product.stock = 50
    await AlphaORM.store(product)
}
// test_1()


/**
 * creating [foreign key]
 */
async function test_2() {
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
// test_2()


/**
 * reading [one] (filter)
 */
async function test_3() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 3 })
    console.log(product)
}
// test_3()


/**
 * reading [all]
 */
async function test_4() {
    products = await AlphaORM.getAll('shop_product')
    console.log(products)
}
// test_4()


/**
 * reading [all] (filter)
 */
async function test_5() {
    products = await AlphaORM.findAll('shop_product', 'id > 0')
    console.log(products)
}
// test_5()


/**
 * update
 */
async function test_6() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 3 })
    product.price = 500
    await AlphaORM.store(product)
}
// test_6()


/**
 * delete
 */
async function test_7() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 2 })
    await AlphaORM.drop(product)
}
// test_7()