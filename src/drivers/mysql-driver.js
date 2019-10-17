const { DriverInterface } = require('./driver-interface')
const { MySQLQueryBuilder } = require('../query-builders/mysql-query-builder')
const { AlphaRecord } = require('../alpha-record')
const mysql = require('mysql')
const util = require('util')
const { AlphaORM } = require('../alpha-orm')

class MySQLDriver extends DriverInterface {

    static get CONNECTION() { return this._connection ? this._connection : '' }
    static set CONNECTION(val) { this._connection = val }
    static setDriver(connection) { MySQLDriver.CONNECTION = connection }

    static async connect() {
        try {
            let options = AlphaORM.OPTIONS
            MySQLDriver.CONNECTION = mysql.createConnection(options)
            return await MySQLDriver.CONNECTION.connect()
        } catch (e) {
            throw e
        }
    }

    static async query(sql) {
        try {
            await this.connect()
            let query = util.promisify(MySQLDriver.CONNECTION.query).bind(MySQLDriver.CONNECTION)
            let response = await query(sql);
            let g = await MySQLDriver.CONNECTION.destroy();
            // console.log(g)
            return response
        } catch (e) {
            throw e
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
        let insert = await this.query(MySQLQueryBuilder.insertRecord(tablename, alpha_record))
        return insert.insertId
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

}

module.exports = { MySQLDriver }