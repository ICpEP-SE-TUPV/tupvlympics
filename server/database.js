/**
 * TUPVLYMPICS
 * Copyright (C) 2023, ICpEP.SE TUPV
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE
})

const connectAsync = new Promise((resolve, reject) => {
  connection.connect((err) => {
    if (err) {
      console.error(err)
      reject(err)
      return
    }

    resolve()
  })
})

async function query (sql, data) {
  await connectAsync
  return new Promise((resolve, reject) => {
    connection.query(sql, data, (err, results, fields) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }

      resolve(results)
    })
  })
}

module.exports = { query }
