const { AlphaORM  } = require('../src/alpha-orm')

AlphaORM.setup('mysql',{
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'hng'
})

AlphaORM.find('records','id = :id ',{id : 1}).then((record)=>{
	console.log(record)
})

// AlphaORM.create('records').then(async (record)=>{
// 	record.firstname = "claret"
// 	record.lastname = "soma"
// 	record.age = 10
// 	record.somaage = 30
// 	AlphaORM.store(record)
// })
