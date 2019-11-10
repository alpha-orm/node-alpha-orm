const { GeneratorInterface } = require('./generator-interface')
const { PostgreSQLQueryBuilder } = require('../query-builders/postgresql-query-builder')
const { array_difference, get_type, is_object_empty } = require('../utilities')
const { AlphaRecord } = require('../alpha-record')
const { AlphaORM } = require('../alpha-orm')

class PostgreSQLGenerator extends GeneratorInterface {

    static checkColumnUpdates(columns_db, columns_record, alpha_record) {
        let updated_columns = {}
        let existing = []
        columns_db.forEach(col => {
            if (columns_record.includes(col.Field)) {
                existing.push(col.Field)
                // if type is not supported
                if (col.Field !== 'id' & !(col.Type.startsWith(PostgreSQLQueryBuilder.DATA_TYPE[get_type(alpha_record[col.Field])]))) {
                    if (!AlphaORM.DATA_TYPES.includes(typeof(col.Field))) {
                        throw new Error(`Values of can only be number, string or boolean`)
                        //  if colum is int but value comming in is not an int
                    } else if (col.Type.startsWith(PostgreSQLQueryBuilder.DATA_TYPE['int']) & (get_type(alpha_record[col.Field]) !== 'boolean')) {
                        updated_columns[col.Field] = PostgreSQLQueryBuilder.DATA_TYPE[get_type(alpha_record[col.Field])]
                        // if colum is boolean but value coming in is not boolean
                    } else if (col.Type.startsWith(PostgreSQLQueryBuilder.DATA_TYPE['boolean']) & (typeof alpha_record[col.Field] !== 'boolean')) {
                        if (typeof alpha_record[col.Field] !== 'number') {
                            updated_columns[col.Field] = PostgreSQLQueryBuilder.DATA_TYPE[get_type(alpha_record[col.Field])]
                        } else {
                            updated_columns[col.Field] = PostgreSQLQueryBuilder.DATA_TYPE['string']
                        }
                    }
                }
            }
        })
        return { updated_columns, existing }
    }

    static creatNewColumns(map, alpha_record, tablename) {
        let new_columns = {}
        for (let col of Object.values(map)) {
            if (col == '_tablename') {
                continue
            }
            if (col instanceof AlphaRecord) {
                this.columns(col._tablename, col)
            } else if (!AlphaORM.DATA_TYPES.includes(typeof(col))) {
                throw new Error(`Values can only be number, string or boolean`)
            } else {
                if (alpha_record[col] instanceof AlphaRecord) {
                    new_columns[`${alpha_record[col]._tablename}_id`] = PostgreSQLQueryBuilder.DATA_TYPE['int']
                } else {
                    new_columns[col] = PostgreSQLQueryBuilder.DATA_TYPE[get_type(alpha_record[col])]
                }
            }
        }
        return new_columns
    }

    static async columns(columns_db, alpha_record, base = true) {
        let tablename = alpha_record._tablename

        // alow for custom id?
        alpha_record.id = null

        delete alpha_record.__tablename

        let columns_record = Object.keys(alpha_record)
        let { updated_columns, existing } = this.checkColumnUpdates(columns_db, columns_record, alpha_record)
        let diff_array = array_difference(columns_record, existing)
        let new_columns = this.creatNewColumns(diff_array, alpha_record, tablename)
        return { updated_columns, new_columns }
    }
}

module.exports = { PostgreSQLGenerator }