const { AlphaORM } = require('../index')
const { creating, creating_2, reading, reading_2, reading_3, update, del } = require('./test')

AlphaORM.setup('sqlite', {
    database: 'alphaorm'
})

// creating()
// creating_2()
// reading()
// reading_2()
// reading_3()
// update()
// del()