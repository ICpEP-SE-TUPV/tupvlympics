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
const multer = require('multer')
const jwt = require('jsonwebtoken')

const database = require('./database')
const asyncWrap = require('./utils/async-wrap')

const router = express.Router()
const upload = multer()
const uploadLogo = upload.fields([
  {
    name: 'logo',
    maxCount: 1
  }
])

router.get('/teams', asyncWrap(async (req, res) => {
  const sort = typeof req.query.sort !== 'undefined'
  const tabulation = typeof req.query.tabulation !== 'undefined'
  const query = `
    SELECT
      teams.*,
      (
        SELECT COALESCE(SUM(scores.score), 0)
        FROM scores WHERE scores.team = teams.id
      ) AS score
    FROM teams
    ${sort ? 'ORDER BY score DESC' : ''}
  `

  const results = await database.query(query)
  const teams = []
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    teams.push({
      id: result.id,
      name: result.name,
      courses: result.courses,
      score: result.score
    })
  }

  if (tabulation) {
    const catRes = await database.query('SELECT * FROM categories GROUP BY maincategory')
    for (let i = 0; i < teams.length; i++) {
      teams[i].tabulation = []
      for (let j = 0; j < catRes.length; j++) {
        const catId = catRes[j].id
        const scoreRes = await database.query('SELECT * FROM scores WHERE team=? AND category=?', [teams[i].id, catId])
        teams[i].tabulation[j] = scoreRes.length > 0 ? parseInt(scoreRes[0].score) : 0
      }
    }
  }

  res.json({
    success: true,
    message: '',
    teams
  })
}))

router.get('/teams/:id/logo', asyncWrap(async (req, res) => {
  const id = req.params.id
  const query = 'SELECT logo FROM teams WHERE id=?'
  const results = await database.query(query, [id])
  if (results.length === 0) {
    res.send('File not found')
    return
  }

  res.send(results[0].logo)
}))

router.delete('/teams/:id', asyncWrap(async (req, res) => {
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

  await database.query('DELETE FROM scores WHERE team=?', [id])
  await database.query('DELETE FROM teams WHERE id=?', [id])
  res.json({
    success: true,
    message: ''
  })
}))

router.post('/teams', uploadLogo, asyncWrap(async (req, res) => {
  const logo = req.files.logo[0]
  const name = req.body.name
  const courses = req.body.courses
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

  await database.query('INSERT INTO teams (name, courses, logo) VALUES (?, ?, ?)', [name, courses, logo.buffer])
  res.json({
    success: true,
    message: ''
  })
}))

router.post('/teams/:id', upload.any(), asyncWrap(async (req, res) => {
  const id = req.params.id
  const logo = req.files.length > 0 ? req.files[0] : undefined
  const name = req.body.name
  const courses = req.body.courses
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

  await database.query('UPDATE teams SET name=?, courses=? WHERE id=?', [name, courses, id])
  if (logo) {
    await database.query('UPDATE teams SET logo=? WHERE id=?', [logo.buffer, id])
  }

  res.json({
    success: true,
    message: ''
  })
}))

module.exports = router
