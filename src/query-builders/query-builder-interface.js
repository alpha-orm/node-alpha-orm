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

    static getQueryBuilder(driver) {
        switch (driver) {
            case 'mysql':
                const { MySQLQueryBuilder } = require('./mysql-query-builder')
                return MySQLQueryBuilder
                break;
        }
    }
}

module.exports = { QueryBuilderInterface }