const { DriverInterface } = require('./drivers/driver-interface')
const { QueryBuilderInterface } = require('./query-builders/query-builder-interface')
const { GeneratorInterface } = require('./generators/generator-interface')
const { AlphaRecord } = require('./alpha-record')
const util = require('util')
const { array_difference, get_type, is_object_empty } = require('./utilities')

class AlphaORM {

    static get DATA_TYPES() { return ['number', 'string', 'boolean'] }

    static get DRIVER() { return this._driver ? this._driver : '' }
    static set DRIVER(val) { this._driver = val }
    static setDriver(driver) { AlphaORM.DRIVER = driver }

    static get OPTIONS() { return this._options ? this._options : '' }
    static set OPTIONS(val) { this._options = val }
    static setOptions(options) { AlphaORM.OPTIONS = options }



    static setup(driver, options) {
        this.setDriver(driver)
        this.setOptions(options)
    }

    static async store(alpha_record) {
        try {
            if ((alpha_record instanceof AlphaRecord) == false) {
                throw new Error('Parameter passed into method `store` must be of type `AlphaRecord`')
            }

            for (let col in alpha_record) {
                if (col == '_tablename' | col == 'id') {
                    continue
                }
                if (col.includes('_')) {
                    throw new Error('Column names cannot contain `_` symbol')
                }
                if ((col.indexOf(' ') > -1)) {
                    throw new Error('Column names should not have a space')
                }
            }

            let tablename = alpha_record._tablename

            // alow for custom id?
            alpha_record.id = null

            delete alpha_record._tablename

            let columns_db = await DriverInterface.getDriver(AlphaORM.DRIVER).getColumns(tablename)
            let columns_record = Object.keys(alpha_record)
            let { updated_columns, existing } = GeneratorInterface.getGenerator(AlphaORM.DRIVER).checkColumnUpdates(columns_db, columns_record, alpha_record)
            let diff_array = array_difference(columns_record, existing)
            let new_columns = GeneratorInterface.getGenerator(AlphaORM.DRIVER).creatNewColumns(diff_array, alpha_record)

            if (!is_object_empty(updated_columns)) {
                await DriverInterface.getDriver(AlphaORM.DRIVER).updateColumns(tablename, updated_columns)
            }
            if (!is_object_empty(new_columns)) {
                await DriverInterface.getDriver(AlphaORM.DRIVER).createColumns(tablename, new_columns)
            }
            alpha_record.id = await DriverInterface.getDriver(AlphaORM.DRIVER).insertRecord(tablename, alpha_record)
            alpha_record._tablename = tablename
            return true
        } catch (e) {
            throw e
        }
    }

    static destroy(alpha_db) {

    }

    static async create(table_name) {
        let c = await DriverInterface.getDriver(AlphaORM.DRIVER).createTable(table_name)
        return new AlphaRecord(table_name)
    }

    static async getAll(table_name) {
        return await DriverInterface.getDriver(AlphaORM.DRIVER).getAll(table_name)
    }

    static async find(table_name, where, map) {
        return await DriverInterface.getDriver(AlphaORM.DRIVER).find(table_name, where, map)
    }

    static async findAll(table_name, where, map) {
        return await DriverInterface.getDriver(AlphaORM.DRIVER).findAll(table_name, where, map)
    }

    static query(sql) {
        return DriverInterface.getDriver(AlphaORM.DRIVER).query(sql)
    }
}

module.exports = { AlphaORM }