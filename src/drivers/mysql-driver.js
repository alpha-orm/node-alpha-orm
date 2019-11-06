const { DriverInterface } = require('./driver-interface')
const { MySQLQueryBuilder } = require('../query-builders/mysql-query-builder')
const { AlphaRecord } = require('../alpha-record')
const mysql = require('mysql')
const util = require('util')
const { AlphaORM } = require('../alpha-orm')
const { MySQLGenerator } = require('../generators/mysql-generator')
const { array_difference, get_type, is_object_empty } = require('../utilities')

class MySQLDriver extends DriverInterface {

    static get CONNECTION() { return this._connection ? this._connection : '' }
    static set CONNECTION(val) { this._connection = val }
    static setDriver(connection) { this.CONNECTION = connection }

    static async connect() {
        try {
            let options = AlphaORM.OPTIONS
            this.CONNECTION = mysql.createConnection(options)
            return await this.CONNECTION.connect()
        } catch (e) {
            throw e
        }
    }

    static async query(sql) {
        try {
            await this.connect()
            let query = util.promisify(this.CONNECTION.query).bind(this.CONNECTION)
            let response = await query(sql);
            return response
        } catch (e) {
            console.log(e)
        } finally {
            let g = await this.CONNECTION.destroy()
        }
    }

    static async createTable(table_name) {
        return await this.query(MySQLQueryBuilder.createTable(table_name))
    }

    static async getAll(tablename) {
        let rows = await this.query(MySQLQueryBuilder.getAllRecords(tablename))
        return AlphaRecord.create(tablename, rows)
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
        let insert = await this.query(MySQLQueryBuilder.insertRecord(tablename, alpha_record))
        for (let a of Object.keys(inserted)) {
            alpha_record[a] = inserted[a]
            delete alpha_record[`${alpha_record[a]._tablename}_id`]
        }
        return insert.insertId
    }

    static async updateRecord(alpha_record) {
        let id = alpha_record._id
        let tablename = alpha_record._tablename
        delete alpha_record.id
        delete alpha_record._tablename
        let update = await this.query(MySQLQueryBuilder.updateRecord(tablename, alpha_record, id))
        alpha_record.id = id
        alpha_record._tablename = tablename
        Object.defineProperty(alpha_record, '_tablename', {
            writable: false
        });
        return alpha_record
    }

    static async getColumns(tablename) {
        return await this.query(MySQLQueryBuilder.getColumns(tablename))
    }

    static async updateColumns(tablename, updated_columns) {
        await this.query(MySQLQueryBuilder.updateColumns(tablename, updated_columns))
    }

    static async createColumns(tablename, new_columns) {
        await this.query(MySQLQueryBuilder.createColumns(tablename, new_columns))
    }

    static async find(tablename, where, map) {
        let row = await this.query(MySQLQueryBuilder.find(true, tablename, where, map))
        if (row.length == 0) {
            throw new Error('No record found for corresponding query')
        }
        return AlphaRecord.create(tablename, row, true)
    }

    static async findAll(tablename, where, map) {
        let rows = await this.query(MySQLQueryBuilder.find(false, tablename, where, map))
        return AlphaRecord.create(tablename, rows)
    }

    static async store(alpha_record, base = true) {
        try {
            if (alpha_record._id) {
                return this.updateRecord(alpha_record)
            }
            for (let a of Object.keys(alpha_record)) {
                if (alpha_record[a] instanceof AlphaRecord) {
                    alpha_record[a] = await this.store(alpha_record[a], false)
                }
            }
            let tablename = alpha_record._tablename

            let columns_db = await this.getColumns(tablename)

            let { updated_columns, new_columns } = await MySQLGenerator.columns(columns_db, alpha_record)

            if (!is_object_empty(updated_columns)) {
                await this.updateColumns(tablename, updated_columns)
            }
            if (!is_object_empty(new_columns)) {
                await this.createColumns(tablename, new_columns)
            }
            alpha_record.id = await this.insertRecord(tablename, alpha_record)
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
            await this.query(MySQLQueryBuilder.deleteRecord(alpha_record))
            delete alpha_record._id
        } catch (e) {
            throw e
        }
    }

}

module.exports = { MySQLDriver }