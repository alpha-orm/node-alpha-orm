class AlphaRecord {
    constructor(tablename, fresh = true) {
        if (fresh) { this.id = null }
        this._tablename = tablename
        Object.defineProperty(this, '_tablename', {
            writable: false
        });

    }

    static create(tablename, rows, single = false) {
        let records = []
        for (let row of rows) {
            let record = new AlphaRecord(tablename, false)
            let columns = Object.keys(row)
            for (let column of columns) {
                record[column] = row[column]
            }
            record._id = row.id
            Object.defineProperty(record, '_id', {
                writable: false
            });
            Object.defineProperty(record, 'id', {
                writable: false
            });
            records.push(record)
        }
        return single ? records[0] : records
    }
}

module.exports = { AlphaRecord }