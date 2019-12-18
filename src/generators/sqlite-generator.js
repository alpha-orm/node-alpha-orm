const { GeneratorInterface } = require('./generator-interface')
const { SQLiteQueryBuilder } = require('../query-builders/sqlite-query-builder')
const { array_difference, get_type, is_object_empty } = require('../utilities/functions')
const constants = require('../utilities/constants')
const { AlphaRecord } = require('../alpha-record')
const { AlphaORM } = require('../alpha-orm')

class SQLiteGenerator extends GeneratorInterface {

    static checkColumnUpdates(columns_db, columns_record, alpha_record) {
        let updated_columns = {}
        let existing = []
        let present_columns = []
        columns_db.forEach(col => {
            present_columns.push(col.name)
            if (columns_record.includes(col.name)) {
                existing.push(col.name)
                // if type is not supported
                if (col.name !== 'id' & !(col.type.startsWith(SQLiteQueryBuilder.DATA_TYPE[get_type(alpha_record[col.name])]))) {
                    if (!AlphaORM.DATA_TYPES.includes(typeof(col.name))) {
                        throw new Error(constants.DB_VARIABLE_ERROR)
                        //  if colum is int but value comming in is not an int
                    } else if (col.type.startsWith(SQLiteQueryBuilder.DATA_TYPE['int']) & (get_type(alpha_record[col.name]) !== 'boolean')) {
                        updated_columns[col.name] = SQLiteQueryBuilder.DATA_TYPE[get_type(alpha_record[col.name])]
                        // if colum is boolean but value coming in is not boolean
                    } else if (col.type.startsWith(SQLiteQueryBuilder.DATA_TYPE['boolean']) & (typeof alpha_record[col.name] !== 'boolean')) {
                        if (typeof alpha_record[col.name] == 'number') {
                            updated_columns[col.name] = SQLiteQueryBuilder.DATA_TYPE[get_type(alpha_record[col.name])]
                        } else {
                            updated_columns[col.name] = SQLiteQueryBuilder.DATA_TYPE['string']
                        }
                    }
                }
            }
        })
        return { updated_columns, existing, present_columns }
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
                throw new Error(constants.DB_VARIABLE_ERROR)
            } else {
                if (alpha_record[col] instanceof AlphaRecord) {
                    new_columns[`${alpha_record[col]._tablename}_id`] = SQLiteQueryBuilder.DATA_TYPE['int']
                } else {
                    new_columns[col] = SQLiteQueryBuilder.DATA_TYPE[get_type(alpha_record[col])]
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
        let { updated_columns, existing, present_columns } = this.checkColumnUpdates(columns_db, columns_record, alpha_record)
        let diff_array = array_difference(columns_record, existing)
        let new_columns = this.creatNewColumns(diff_array, alpha_record, tablename)
        return { updated_columns, new_columns, present_columns }
    }
}

module.exports = { SQLiteGenerator }