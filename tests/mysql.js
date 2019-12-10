const { AlphaORM: DB } = require('../index')
const { create, create_2, read, read_2, read_3, update, del, del_2 } = require('./test')

DB.setup('mysql', {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alphaorm'
})

// create()
// create_2()
read()
// read_2()
// read_3()
// update()
// del()
// del_2()