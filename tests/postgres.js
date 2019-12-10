const { AlphaORM } = require('../index')
const { create, create_2, read, read_2, read_3, update, del, del_2 } = require('./test')

AlphaORM.setup('pgsql', {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'alphaorm'
})

// create()
// create_2()
// read()
// read_2()
// read_3()
// update()
// del()
// del_2()