class DriverInterface {

    connect(options) {
        throw new Error('The `connect` method is not yet implemented')
    }
    query(sql) {
        throw new Error('The `query` method is not yet implemanted')
    }

    static getDriver(driver) {
        switch (driver) {
            case 'mysql':
                const { MySQLDriver } = require('./mysql-driver')
                return MySQLDriver
                break;
        }
    }
}

module.exports = { DriverInterface }