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

const asyncWrap = require('./utils/async-wrap')

const router = express.Router()

router.post('/login', asyncWrap(async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const adminUser = process.env.ADMIN_USER
  const adminPass = process.env.ADMIN_PASS
  const jwtSecret = process.env.JWT_SECRET
  const jwtIssuer = process.env.JWT_ISSUER

  if (username === adminUser && password === adminPass) {
    const payload = { user: username }
    const token = jwt.sign(payload, jwtSecret, {
      issuer: jwtIssuer,
      subject: 'Login Token'
    })

    res.json({
      success: true,
      message: '',
      token
    })
  } else {
    res.json({
      success: false,
      message: 'Incorrect credentials',
      token: null
    })
  }
}))

module.exports = router
