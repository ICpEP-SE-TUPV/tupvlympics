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
  const embed = typeof req.query.embed !== 'undefined'
  const maincategory = typeof req.query.maincategory !== 'undefined'
  const subcategory = typeof req.query.subcategory !== 'undefined'
  const results = await database.query(
    'SELECT * FROM categories' +
    (embed ? ' WHERE brackethq != ""' : '') +
    (!maincategory && !subcategory ? ' GROUP BY maincategory' : '')
  )

  const categories = []
  results.forEach((result) => {
    if (maincategory) {
      let added = -1
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i]
        if (category.name === result.maincategory) {
          added = i
          break
        }
      }

      const matches = result.name.match(/^(.+) \((.+)\)$/)
      const subName = matches !== null ? matches[2] : result.name

      if (added < 0) {
        categories.push({
          ids: [result.id],
          name: result.maincategory,
          subs: [subName],
          embed: [result.brackethq]
        })
      } else {
        categories[added].ids.push(result.id)
        categories[added].subs.push(subName)
        categories[added].embed.push(result.brackethq)
      }
    } else {
      categories.push({
        id: result.id,
        name: result.name,
        maincategory: result.maincategory,
        embed: result.brackethq
      })
    }
  })

  res.json({
    success: true,
    message: '',
    categories
  })
}))

router.delete('/categories/:id', asyncWrap(async (req, res) => {
  const id = req.params.id
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

  const results = await database.query('SELECT * FROM categories WHERE id=?', [id])
  if (results.length === 0) {
    res.json({
      success: false,
      message: 'No category found'
    })
    return
  }

  const category = results[0]
  const maincategory = category.maincategory
  if (maincategory !== '') {
    const subsRes = await database.query('SELECT * FROM categories WHERE maincategory=?', [maincategory])
    for (let i = 0; i < subsRes.length; i++) {
      const sub = subsRes[i]
      await database.query('DELETE FROM scores WHERE category=?', [sub.id])
    }

    await database.query('DELETE FROM categories WHERE maincategory=?', [maincategory])
  } else {
    await database.query('DELETE FROM scores WHERE category=?', [id])
    await database.query('DELETE FROM categories WHERE id=?', [id])
  }

  res.json({
    success: true,
    message: ''
  })
}))

router.post('/categories/:id/embed', asyncWrap(async (req, res) => {
  const id = req.params.id
  const embed = req.body.embed
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

  await database.query('UPDATE categories SET brackethq=? WHERE id=?', [embed, id])
  res.json({
    success: true,
    message: ''
  })
}))

router.post('/categories', asyncWrap(async (req, res) => {
  const name = req.body.name
  const subsStr = req.body.subs
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

  const query = 'INSERT INTO categories (name, maincategory) VALUES (?, ?)'
  if (subsStr === '') await database.query(query, [name, name])
  else {
    const subs = subsStr.split(',').map(sub => sub.trim())
    const query = 'INSERT INTO categories (name, maincategory) VALUES (?, ?)'
    for (let i = 0; i < subs.length; i++) {
      const sub = subs[i]
      const subName = `${name} (${sub})`
      await database.query(query, [subName, name])
    }
  }

  res.json({
    success: true,
    message: ''
  })
}))

module.exports = router
