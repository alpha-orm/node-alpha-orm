class AlphaRecord {
    constructor(tablename, fresh = true) {
        if (fresh) { this.id = null }
        this.__tablename = tablename
    }

    static create(tablename, rows, single = false) {
        let records = []
        for (let row of rows) {
            let record = new AlphaRecord(tablename, false)
            let columns = Object.keys(row)
            for (let column of columns) {
                record[column] = row[column]
            }
            records.push(record)
        }
        return single ? records[0] : records
    }

    get _id() {
        return this.id;
    }

    get _tablename() {
        return this.__tablename;
    }
}

module.exports = { AlphaRecord }