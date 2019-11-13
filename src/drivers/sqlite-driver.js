const { DriverInterface } = require('./driver-interface')
const { SQLiteQueryBuilder } = require('../query-builders/sqlite-query-builder')
const { AlphaRecord } = require('../alpha-record')
const Promise = require('bluebird')
const sqlite = require('sqlite')
const { AlphaORM } = require('../alpha-orm')
const { SQLiteGenerator } = require('../generators/sqlite-generator')
const { array_difference, get_type, is_object_empty } = require('../utilities')

class SQLiteDriver extends DriverInterface {

    static get CONNECTION() { return this._connection ? this._connection : '' }
    static set CONNECTION(val) { this._connection = val }

    static async connect() {
        try {
            let options = AlphaORM.OPTIONS
            this.CONNECTION = await sqlite.open(`${options.database}.db`, { Promise })
            return await this.CONNECTION
        } catch (e) {
            throw e
        }
    }

    static async query(sql, retrieve = false) {
        try {
            await this.connect()
            let response = retrieve ? await Promise.resolve(await this.CONNECTION.all(sql)) : await Promise.resolve(await this.CONNECTION.run(sql))
            return response
        } catch (e) {
            console.log(e)
        } finally {
            let g = await this.CONNECTION.close()
        }
    }

    static async createTable(table_name) {
        return await this.query(SQLiteQueryBuilder.createTable(table_name))
    }

    static async getAll(tablename) {
        let rows = await this.query(SQLiteQueryBuilder.getAllRecords(tablename), true)
        return await AlphaRecord.create(tablename, rows)
    }

    static async insertRecord(tablename, alpha_record) {
        let inserted = {}
        for (let a of Object.keys(alpha_record)) {
            if (alpha_record[a] instanceof AlphaRecord) {
                inserted[a] = alpha_record[a]
                alpha_record[`${alpha_record[a]._tablename}_id`] = alpha_record[a].id
                delete alpha_record[a]
            }
        }
        let insert = await this.query(SQLiteQueryBuilder.insertRecord(tablename, alpha_record))
        for (let a of Object.keys(inserted)) {
            alpha_record[a] = inserted[a]
            delete alpha_record[`${alpha_record[a]._tablename}_id`]
        }
        return insert.stmt.lastID
    }

    static async updateRecord(alpha_record) {
        for (let col of Object.keys(alpha_record)) {
            if (alpha_record[col] instanceof AlphaRecord) {
                alpha_record[col] = await this.updateRecord(alpha_record[col])
                delete alpha_record[col]
            }
        }
        let id = alpha_record._id
        let tablename = alpha_record._tablename

        delete alpha_record._id
        delete alpha_record._tablename
        let update = await this.query(SQLiteQueryBuilder.updateRecord(tablename, alpha_record, id))

        alpha_record._id = id
        alpha_record._tablename = tablename

        return alpha_record
    }

    static async getColumns(tablename) {
        return await this.query(SQLiteQueryBuilder.getColumns(tablename), true)
    }

    static async updateColumns(tablename, updated_columns) {
        await this.query(SQLiteQueryBuilder.updateColumns(tablename, updated_columns))
    }

    static async createColumns(tablename, new_columns, present_columns) {
        for (let column of Object.keys(new_columns)) {
            if (present_columns.includes(column)) { continue }
            if (column == '_id' | column == '_tablename') { continue }
            let c = {}
            c[column] = new_columns[column]
            await this.query(SQLiteQueryBuilder.createColumns(tablename, c))
        }
    }

    static async find(tablename, where, map) {
        let row = await this.query(SQLiteQueryBuilder.find(true, tablename, where, map), true)
        if (row.length == 0) {
            throw new Error('No record found for corresponding query')
        }
        return await AlphaRecord.create(tablename, row, true)
    }

    static async findAll(tablename, where, map) {
        let rows = await this.query(SQLiteQueryBuilder.find(false, tablename, where, map), true)
        return await AlphaRecord.create(tablename, rows)
    }

    static async store(alpha_record, base = true) {
        Object.defineProperty(alpha_record, '_id', { configurable: true, writable: true })
        Object.defineProperty(alpha_record, 'id', { configurable: true, writable: true })
        try {
            for (let a of Object.keys(alpha_record)) {
                if (alpha_record[a] instanceof AlphaRecord) {
                    alpha_record[a] = await this.store(alpha_record[a], false)
                }
            }
            let tablename = alpha_record._tablename

            let columns_db = await this.getColumns(tablename)

            let { updated_columns, new_columns, present_columns } = await SQLiteGenerator.columns(columns_db, alpha_record)

            if (!is_object_empty(updated_columns)) {
                await this.updateColumns(tablename, updated_columns)
            }
            if (!is_object_empty(new_columns)) {
                await this.createColumns(tablename, new_columns, present_columns)
            }
            if (alpha_record._id) {
                for (let col of Object.keys(alpha_record)) {
                    if (alpha_record[col] instanceof AlphaRecord) {
                        alpha_record[col] = await this.store(alpha_record[col])
                    }
                }
                Object.defineProperty(alpha_record, 'id', { configurable: true, writable: false })
                Object.defineProperty(alpha_record, '_id', { configurable: true, writable: false })
                return await this.updateRecord(alpha_record)
            }
            alpha_record.id = await this.insertRecord(tablename, alpha_record)
            alpha_record._id = alpha_record.id
            Object.defineProperty(alpha_record, 'id', { configurable: true, writable: false })
            Object.defineProperty(alpha_record, '_id', { configurable: true, writable: false })
            return alpha_record
        } catch (e) {
            throw e
        }
    }


    static async drop(alpha_record) {
        try {
            if (!alpha_record._id) {
                throw new Error('This Record has not been stored yet!')
            }
            await this.query(SQLiteQueryBuilder.deleteRecord(alpha_record))
            delete alpha_record._id
        } catch (e) {
            throw e
        }
    }

    static async dropAll(tablename) {
        return await this.query(SQLiteQueryBuilder.dropAll(tablename))
    }

}

module.exports = { SQLiteDriver }