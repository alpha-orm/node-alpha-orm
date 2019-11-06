const { DriverInterface } = require('./drivers/driver-interface')
const { AlphaRecord } = require('./alpha-record')

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
            alpha_record.forEach((value, index) => {
                if (index == '_tablename') { continue }
                if (index.includes('_')) {
                    throw new Error("Column names cannot contain '_'")
                }
                if ((index.indexOf(' ') > -1)) {
                    throw new Error('Column names should not have spaces in them')
                }
            })
            alpha_record = await DriverInterface.getDriver(AlphaORM.DRIVER).store(alpha_record)
        } catch (e) {
            throw e
        }
    }

    static async drop(alpha_record) {
        await DriverInterface.getDriver(AlphaORM.DRIVER).drop(alpha_record)
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