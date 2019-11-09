class DriverInterface {
    static connect() {
        throw new Error("This driver does not  support the 'connect' function")
    }

    static query(sql) {
        throw new Error("This driver does not  support the 'query' function")
    }

    static createTable(table_name) {
        throw new Error("This driver does not  support the 'createTable' function")
    }

    static getAll(tablename) {
        throw new Error("This driver does not  support the 'getAll' function")
    }

    static insertRecord(tablename, alpha_record) {
        throw new Error("This driver does not  support the 'insertRecord' function")
    }

    static updateRecord(alpha_record) {
        throw new Error("This driver does not  support the 'updateRecord' function")
    }

    static getColumns(tablename) {
        throw new Error("This driver does not  support the 'getColumns' function")
    }

    static updateColumns(tablename, updated_columns) {
        throw new Error("This driver does not  support the 'updateColumns' function")
    }

    static createColumns(tablename, new_columns) {
        throw new Error("This driver does not  support the 'createColumns' function")
    }

    static find(tablename, where, map) {
        throw new Error("This driver does not  support the 'find' function")
    }

    static findAll(tablename, where, map) {
        throw new Error("This driver does not  support the 'findAll' function")
    }

    static store(alpha_record, base = true) {
        throw new Error("This driver does not  support the 'store' function")
    }

    static drop(alpha_record) {
        throw new Error("This driver does not  support the 'drop' function")
    }

    static getDriver(driver) {
        driver = driver.toLocaleLowerCase()
        switch (driver) {
            case 'mysql':
                const { MySQLDriver } = require('./mysql-driver')
                return MySQLDriver
                break;
            case 'sqlite':
                const { SQLiteDriver } = require('./sqlite-driver')
                return SQLiteDriver
                break;
            case 'pgsql':
                const { PostgreSQLDriver } = require('./postgresql-driver')
                return PostgreSQLDriver
                break;
            default:
                throw new Error(`'${driver}' is not a supported database. Supported databases includes mysql, sqlite and pgsql`)
                break;
        }
    }
}

module.exports = { DriverInterface }