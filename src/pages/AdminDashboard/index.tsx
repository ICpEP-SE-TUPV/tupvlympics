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
import { Navigate, NavigateFunction, useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import AdminTeams from '../AdminTeams';
import AdminCategories from '../AdminCategories';
import AdminScores from '../AdminScores';
import AdminCalendar from '../AdminCalendar';
import AdminBrackets from '../AdminBrackets';
import './style.scss';

type Tab = 'teams' | 'categories' | 'scores' | 'calendar' | 'brackets';

interface AdminDashboardWrapProps {}

interface AdminDashboardProps extends AdminDashboardWrapProps {
  navigate: NavigateFunction;
}

interface AdminDashboardState {
  activeTab: Tab;
}

class AdminDashboard extends React.Component<AdminDashboardProps, AdminDashboardState> {
  constructor (props: AdminDashboardProps) {
    super(props);

    this.state = {
      activeTab: 'teams'
    };

    this.logout = this.logout.bind(this);
    this.nav = this.nav.bind(this);
  }

  logout (event: React.MouseEvent) {
    sessionStorage.removeItem('token');
    this.props.navigate('/admin');
  }

  nav (tab: Tab) {
    return (event: React.MouseEvent) => {
      this.setState({ activeTab: tab });
    }
  }

  render () {
    const activeTab = this.state.activeTab;
    const token = sessionStorage.getItem('token');
    if (token === null) return <Navigate to="/admin" />;

    return (
      <React.Fragment>
        <Header page="admin" />

        <main className="dashboard-admin py-3 px-4">
          <div className="dashboard-sidenav">
            <nav className="list-group">
              <button type="button" onClick={this.nav('teams')} className={activeTab === 'teams' ? 'active' : ''}>Teams</button>
              <button type="button" onClick={this.nav('categories')} className={activeTab === 'categories' ? 'active' : ''}>Categories</button>
              <button type="button" onClick={this.nav('scores')} className={activeTab === 'scores' ? 'active' : ''}>Scores</button>
              <button type="button" onClick={this.nav('calendar')} className={activeTab === 'calendar' ? 'active' : ''}>Calendar</button>
              <button type="button" onClick={this.nav('brackets')} className={activeTab === 'brackets' ? 'active' : ''}>Brackets</button>
            </nav>

            <button type="button" onClick={this.logout} className="btn btn-secondary btn-block mt-3">Log Out</button>
          </div>

          <div className="dashboard-card">
            { activeTab === 'teams' && <AdminTeams /> }
            { activeTab === 'categories' && <AdminCategories /> }
            { activeTab === 'scores' && <AdminScores /> }
            { activeTab === 'calendar' && <AdminCalendar /> }
            { activeTab === 'brackets' && <AdminBrackets /> }
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default function AdminDashboardWrap (props: AdminDashboardWrapProps) {
  const navigate = useNavigate();
  return <AdminDashboard navigate={navigate} />;
}

