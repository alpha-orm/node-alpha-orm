const { AlphaORM } = require('../index')

/**
* Implemented for:
* -mysql [completed]
* -sqlite [completed]
* -postgres [completed]
* -mongodb [undone]
* -sqlserver [undone]
*/


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
    student.happy = true
    await AlphaORM.store(student)
}

/**
 * reading [one] (filter)
 */
async function reading() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 1 })
    console.log(product)
}


/**
 * reading [all]
 */
async function reading_2() {
    products = await AlphaORM.getAll('shop_product')
    console.log(products)
}

/**
 * reading [all] (filter)
 */
async function reading_3() {
    products = await AlphaORM.findAll('student', 'id > 0')
    console.log(products)
}

/**
 * update
 */
async function update() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 1 })
    product.price = 500
    await AlphaORM.store(product)
    product.price = 5000
    await AlphaORM.store(product)
    console.log(product)
}


/**
 * delete
 */
async function del() {
    product = await AlphaORM.find('shop_product', 'id = :id', { id: 1 })
    await AlphaORM.drop(product)
}


/**
 * delete_2
 */
async function del_2() {
    await AlphaORM.dropAll('shop_product')
}


module.exports = { creating, creating_2, reading, reading_2, reading_3, update, del, del_2 }