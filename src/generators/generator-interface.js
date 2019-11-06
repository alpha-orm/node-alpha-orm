class GeneratorInterface {

    static checkColumnUpdates(columns_db, columns_record, alpha_record) {
        throw new Error("This generator does not  support the 'checkColumnUpdates' function")
    }

    static creatNewColumns(map, alpha_record, tablename) {
        throw new Error("This generator does not  support the 'creatNewColumns' function")
    }

    static columns(columns_db, alpha_record, base = true) {
        throw new Error("This generator does not  support the 'columns' function")
    }

    static getGenerator(driver) {
        switch (driver) {
            case 'mysql':
                const { MySQLGenerator } = require('./mysql-generator')
                return MySQLGenerator
                break;
            default:
                throw new Error(`'${driver}' is not a supported database. Supported databases includes mysql`)
                break;
        }
    }
}

module.exports = { GeneratorInterface }