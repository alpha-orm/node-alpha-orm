class AlphaRecord {
    constructor(tablename, fresh = true) {
        if (fresh) { this.id = null }
        this._tablename = tablename
        Object.defineProperty(this, '_tablename', { configurable: true, writable: false })
    }

    getID() {
        return this.id
    }

    static async create(tablename, rows, single = false) {
        let records = []
        for (let row of rows) {
            let record = new AlphaRecord(tablename, false)
            let columns = Object.keys(row)
            for (let column of columns) {
                if (column.endsWith('_id')) {
                    const { AlphaORM } = require('./alpha-orm')
                    let table = column.replace('_id', '')
                    record[table] = await this.handleEmbedding(AlphaORM.DRIVER, table, row[column])
                    continue
                }
                record[column] = row[column]
            }
            record._id = row.id
            Object.defineProperty(record, 'id', { configurable: true, writable: false })
            Object.defineProperty(record, '_id', { configurable: true, writable: false })
            records.push(record)
        }
        return single ? records[0] : records
    }

    static async handleEmbedding(driver, tablename, id) {
        const { AlphaORM } = require('./alpha-orm')
        switch (driver) {
            case 'mysql':
            case 'sqlite':
            case 'pgsql':
                return await AlphaORM.find(tablename, 'id = :id', { id })
                break;
            default:
                const constants = require('./utilities/constants')
                throw new Error(constants.DRIVER_NOT_SUPPORTED(driver))
                break;
        }

    }
}

module.exports = { AlphaRecord }