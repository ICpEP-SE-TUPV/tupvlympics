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

const express = require('express')
const jwt = require('jsonwebtoken')

const database = require('./database')
const asyncWrap = require('./utils/async-wrap')

const router = express.Router()

router.get('/categories', asyncWrap(async (req, res) => {
  const results = await database.query('SELECT * FROM categories')
  const categories = []
  results.forEach((result) => {
    categories.push({
      id: result.id,
      name: result.name
    })
  })

  res.json({
    success: true,
    message: '',
    categories
  })
}))

router.delete('/categories/:id', asyncWrap(async (req, res) => {
  const id = req.params.id
  await database.query('DELETE FROM scores WHERE category=?', [id])
  await database.query('DELETE FROM categories WHERE id=?', [id])
  res.json({
    success: true,
    message: ''
  })
}))

router.post('/categories', asyncWrap(async (req, res) => {
  const name = req.body.name
  const auth = req.get('Authorization')
  const jwtSecret = process.env.JWT_SECRET
  const jwtIssuer = process.env.JWT_ISSUER

  try {
    if (!auth.match(/^(Bearer ([\w-]*\.[\w-]*\.[\w-]*))$/i)) throw new Error('Invalid token')

    const token = auth.split(' ')[1]
    jwt.verify(token, jwtSecret, {
      issuer: jwtIssuer,
      subject: 'Login Token'
    })
  } catch (error) {
    res.json({
      success: false,
      message: 'Invalid token'
    })
    return
  }

  await database.query('INSERT INTO categories (name) VALUES (?)', [name])
  res.json({
    success: true,
    message: ''
  })
}))

module.exports = router
