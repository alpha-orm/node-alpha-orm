const { AlphaORM } = require('../index')
const { creating, creating_2, reading, reading_2, reading_3, update, del } = require('./test')

AlphaORM.setup('mysql', {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alphaorm'
})

// creating()
// creating_2()
// reading()
// reading_2()
// reading_3()
// update()
// del()