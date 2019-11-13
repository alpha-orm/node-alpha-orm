const { AlphaORM } = require('../index')
const { creating, creating_2, reading, reading_2, reading_3, update, del } = require('./test')

AlphaORM.setup('pgsql', {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'alphaorm'
})

// creating()
// creating_2()
// reading()
// reading_2()
// reading_3()
// update()
// del()
// del_2()