const { array_difference, get_type, is_object_empty } = require('../utilities/functions')
const constants = require('../utilities/constants')

class SQLiteQueryBuilder {

    static get DATA_TYPE() { return { double: 'real', string: 'text', boolean: 'smallint', int: 'int' } }

    static createTable(tablename) {
        return `CREATE TABLE IF NOT EXISTS \`${tablename}\` (id integer PRIMARY KEY AUTOINCREMENT)`;
    }

    static createColumns(tablename, map) {
        let sql = `ALTER TABLE \`${tablename}\` `
        let columns = Object.keys(map)
        for (let column of columns) {
            sql += `ADD COLUMN \`${column}\` ${map[column]}`
            sql += column == columns[columns.length - 1] ? `;` : ','
        }
        return sql
    }

    static getColumns(tablename) {
        return `PRAGMA table_info(\`${tablename}\`)`
    }

    static updateColumns(tablename, map) {
        let sql = `ALTER TABLE \`${tablename}\``
        let columns = Object.keys(map)
        for (let column of columns) {
            sql += `MODIFY COLUMN \`${column}\` ${map[column]}`
            sql += column == columns[columns.length - 1] ? `;` : ','
        }
        return sql
    }

    static getAllRecords(tablename) {
        return `SELECT * FROM \`${tablename}\``
    }

    static insertRecord(tablename, map) {
        let sql = `INSERT INTO \`${tablename}\` (`
        let columns = Object.keys(map)
        for (let column of columns) {
            if (column == '_tablename') { continue }
            sql += `\`${column}\``
            sql += column == columns[columns.length - 1] ? `) VALUES (` : ','
        }
        for (let column of columns) {
            if (column == '_tablename') { continue }
            let colVal = map[column]
            if (typeof colVal === 'boolean') {
                colVal = true ? 1 : 0;
            }
            sql += JSON.stringify(colVal)
            sql += column == columns[columns.length - 1] ? `);` : ','
        }
        return sql
    }

    static updateRecord(tablename, map, id) {
        let sql = `UPDATE \`${tablename}\` `
        let columns = Object.keys(map)
        for (let column of columns) {
            let colVal = map[column]
            if (typeof colVal === 'boolean') {
                colVal = true ? 1 : 0;
            }
            colVal = JSON.stringify(colVal)
            sql += column == columns[0] ? `SET ` : ``
            if (column == '_id' | column == '_tablename' | column == 'id') { continue }
            sql += `\`${column}\` = ${colVal}`
            sql += column == columns[columns.length - 1] ? ` WHERE \`id\` = ${id};` : ', '
        }
        return sql
    }

    static deleteRecord(map) {
        return `DELETE FROM \`${map._tablename}\` WHERE \`id\` = ${map._id}`
    }

    static find(single, tablename, where, map = {}) {
        let sql = `SELECT * FROM \`${tablename}\` WHERE `
        let columns = Object.keys(map)
        let matches = where.match(/:[a-zA-Z]+/g)
        if (is_object_empty(map)) {
            sql += where
            sql += single ? ' LIMIT 1;' : ';'
            return sql
        }
        if (matches.length !== Object.keys(map).length) {
            throw new Error(constants.UNEQUAL_BOUNDED_PARAMETER)
        }
        matches.forEach((match) => {
            let i = match.replace(':', '')
            let val = map[i]
            if (val === undefined) {
                throw new Error(constants.VARIABLE_NOT_PRESENT(i))
            }
            val = (typeof(val) === 'string') ? val.replace('\'', '\\\'') : val
            if (typeof(val) === 'boolean') {
                val = val === true ? 1 : 0
            }
            val = JSON.stringify(val)
            where = where.replace(match, val)
        })
        sql += where
        sql += single ? ' LIMIT 1;' : ';'
        return sql
    }

    static dropAll(tablename) {
        return `DELETE FROM \`${tablename}\``
    }

}

module.exports = { SQLiteQueryBuilder }