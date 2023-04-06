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

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Schedules from './pages/Schedules';
import Teams from './pages/Teams';
import Brackets from './pages/Brackets';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import './App.scss';

class App extends React.Component {
  render () {
    return (
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/brackets" element={<Brackets />} />
        <Route path="/admin">
          <Route index element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    );
  }
}

export default App;
