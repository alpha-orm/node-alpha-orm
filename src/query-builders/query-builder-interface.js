const constants = require('../utilities/constants')
class QueryBuilderInterface {

    static createTable(tablename) {
        throw new Error("This builder does not  support the 'createTable' function")
    }

    static createColumns(tablename, map) {
        throw new Error("This builder does not  support the 'createColumns' function")
    }

    static getColumns(tablename) {
        throw new Error("This builder does not  support the 'getColumns' function")
    }

    static updateColumns(tablename, map) {
        throw new Error("This builder does not  support the 'updateColumns' function")
    }

    static getAllRecords(tablename) {
        throw new Error("This builder does not  support the 'getAllRecords' function")
    }

    static insertRecord(tablename, map) {
        throw new Error("This builder does not  support the 'insertRecord' function")
    }

    static updateRecord(tablename, map, id) {
        throw new Error("This builder does not  support the 'updateRecord' function")
    }

    static deleteRecord(map) {
        throw new Error("This builder does not  support the 'deleteRecord' function")
    }

    static find(single, tablename, where, map = {}) {
        throw new Error("This builder does not  support the 'find' function")
    }

    static dropAll(tablename) {
        throw new Error("This builder does not  support the 'dropAll' function")
    }

    static getQueryBuilder(driver) {
        driver = driver.toLocaleLowerCase()
        switch (driver) {
            case 'mysql':
                const { MySQLQueryBuilder } = require('./mysql-query-builder')
                return MySQLQueryBuilder
                break;
            case 'sqlite':
                const { SQLiteQueryBuilder } = require('./sqlite-query-builder')
                return SQLiteQueryBuilder
                break;
            case 'pgsql':
                const { PostgreSQLQueryBuilder } = require('./postgresql-query-builder')
                return PostgreSQLQueryBuilder
                break;
            default:
                throw new Error(constants.DRIVER_NOT_SUPPORTED(driver))
                break;
        }
    }
}

module.exports = { QueryBuilderInterface }