class QueryBuilderInterface {

    createTable(tablename) {
        throw new Error('The `createTable` method is not yet implemented')
    }

    createColumns(tablename, map) {
        throw new Error('The `createColumns` method is not yet implemented')
    }

    getAll(tablename) {
        throw new Error('The `getAll` method is not yet implemented')
    }

    getColumns(tablename) {
        throw new Error('The `getColumns` method is not yet implemented')
    }

    updateColumns(tablename, map) {
        throw new Error('The `updateColumns` method is not yet implemented')
    }

    insertRecord(tablename, map) {
        throw new Error('The `insertRecord` method is not yet implemented')
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