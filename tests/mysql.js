const { AlphaORM } = require('../index')
const { creating, creating_2, reading, reading_2, reading_3, update, del, del_2 } = require('./test')

const DB = AlphaORM

DB.setup('mysql', {
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
// del_2()


async function d() {
	student = await DB.find('student','id = 1')
	console.log(student)
	student.user.hehe = 'Alpha'
	console.log(student)
	DB.store(student)
}
d()