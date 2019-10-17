class GeneratorInterface {

    checkColumnUpdates(columns_db, columns_record, alpha_record) {
        throw new Error('`checkColumnUpdates` is not yet implemented')
    }

    creatNewColumns(map, alpha_record) {
        throw new Error('`creatNewColumns` is not yet implemented')
    }

    static getGenerator(driver) {
        switch (driver) {
            case 'mysql':
                const { MySQLGenerator } = require('./mysql-generator')
                return MySQLGenerator
                break;
        }
    }
}

module.exports = { GeneratorInterface }