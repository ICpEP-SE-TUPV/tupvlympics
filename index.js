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

const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

let configPath = path.resolve(__dirname, '.env.local')
if (!fs.existsSync(configPath)) configPath = path.resolve(__dirname, '.env')
dotenv.config({ path: configPath })

const dataPath = path.resolve(__dirname, 'data')
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath)

const api = require('./server/api')
const app = express()
const port = process.env.PORT || '3001'
const publicPath = path.resolve(__dirname, 'build')

app.use(cors())

app.use('/', express.static(publicPath))

app.use('/api', api)

app.use((req, res, next) => {
  const indexPath = path.resolve(publicPath, 'index.html')
  res.sendFile(indexPath)
})

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err
  })
})

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`)
})
