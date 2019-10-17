const { GeneratorInterface } = require('./generator-interface')
const { MySQLQueryBuilder } = require('../query-builders/mysql-query-builder')
const { array_difference, get_type, is_object_empty } = require('../utilities')
const { AlphaRecord } = require('../alpha-record')
const { AlphaORM } = require('../alpha-orm')

class MySQLGenerator extends GeneratorInterface {

    static checkColumnUpdates(columns_db, columns_record, alpha_record) {
        let updated_columns = {}
        let existing = []
        columns_db.forEach(col => {
            if (columns_record.includes(col.Field)) {
                existing.push(col.Field)
                // if type is not supported
                if (col.Field !== 'id' & !(col.Type.startsWith(MySQLQueryBuilder.DATA_TYPE[get_type(alpha_record[col.Field])]))) {
                    if (!AlphaORM.DATA_TYPES.includes(typeof(col.Field))) {
                        throw new Error(`Values of can only be number, string or boolean`)
                        //  if colum is int but value comming in is not an int
                    } else if (col.Type.startsWith(MySQLQueryBuilder.DATA_TYPE['int']) & (get_type(alpha_record[col.Field]) !== 'boolean')) {
                        updated_columns[col.Field] = MySQLQueryBuilder.DATA_TYPE[get_type(alpha_record[col.Field])]
                        // if colum is boolean but value coming in is not boolean
                    } else if (col.Type.startsWith(MySQLQueryBuilder.DATA_TYPE['boolean']) & (typeof alpha_record[col.Field] !== 'boolean')) {
                        if (typeof alpha_record[col.Field] !== 'number') {
                            updated_columns[col.Field] = MySQLQueryBuilder.DATA_TYPE[get_type(alpha_record[col.Field])]
                        } else {
                            updated_columns[col.Field] = MySQLQueryBuilder.DATA_TYPE['string']
                        }
                    }
                }
            }
        })
        return { updated_columns, existing }
    }

    static creatNewColumns(map, alpha_record) {
        let new_columns = {}
        map.forEach(col => {
            if (col instanceof AlphaRecord) {
                throw new Error('Comming Soon!')
            } else if (!AlphaORM.DATA_TYPES.includes(typeof(col))) {
                throw new Error(`Values can only be number, string or boolean`)
            } else {
                new_columns[col] = MySQLQueryBuilder.DATA_TYPE[get_type(alpha_record[col])]
            }
        })
        return new_columns
    }
}

module.exports = { MySQLGenerator }