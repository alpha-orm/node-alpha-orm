const { DriverInterface } = require('./drivers/driver-interface')
const { QueryBuilderInterface } = require('./query-builders/query-builder-interface')
const { GeneratorInterface } = require('./generators/generator-interface')
const { AlphaRecord } = require('./alpha-record')
const util = require('util')
const { array_difference, get_type, is_object_empty } = require('./utilities/functions')
const constants = require('./utilities/constants')

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
        for (let option of DriverInterface.getDriver(AlphaORM.DRIVER).REQUIRED_FIELDS) {
            if (options[option] === undefined) {
                throw new Error(constants.SETUP_OPTION_MISSING(option))
            }
        }
        this.setOptions(options)
    }

    static async store(alpha_record) {
        if (Object.keys(alpha_record).length == 0) {
            return
        }
        try {
            if ((alpha_record instanceof AlphaRecord) == false) { throw new Error('Parameter passed into method `store` must be of type `AlphaRecord`') }

            for (let col in alpha_record) {
                if (col == '_tablename' | col == '_id') { continue }
                if (col.includes('_')) { throw new Error('Column names cannot contain `_` symbol') }
                if ((col.indexOf(' ') > -1)) { throw new Error('Column names should not have a space') }
            }
            alpha_record = await DriverInterface.getDriver(AlphaORM.DRIVER).store(alpha_record)
        } catch (e) {
            throw e
        }
    }

    static async drop(alpha_record) {
        if ((alpha_record instanceof AlphaRecord) == false) { throw new Error('Parameter passed into method `drop` must be of type `AlphaRecord`') }
        await DriverInterface.getDriver(AlphaORM.DRIVER).drop(alpha_record)
    }

    static async create(table_name) {
        let c = await DriverInterface.getDriver(AlphaORM.DRIVER).createTable(table_name)
        return new AlphaRecord(table_name)
    }

    static async dropAll(table_name) {
        await DriverInterface.getDriver(AlphaORM.DRIVER).dropAll(table_name)
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