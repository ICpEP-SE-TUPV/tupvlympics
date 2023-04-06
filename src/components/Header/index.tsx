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
import { Link } from 'react-router-dom';

import { ReactComponent as MenuIcon } from '../../assets/bars.svg';
import './style.scss';

type HeaderPage = "homepage" | "schedules" | "teams" | "brackets" | "admin";

interface HeaderProps {
  page: HeaderPage;
}

interface HeaderState {
  menuToggled: boolean;
}

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor (props: HeaderProps) {
    super(props);

    this.state = {
      menuToggled: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu (event: React.MouseEvent) {
    const toggled = this.state.menuToggled;
    this.setState({ menuToggled: !toggled });
  }

  render () {
    const page = this.props.page;
    const menuToggled = this.state.menuToggled;

    return (
      <header className="page-header">
        <div className="page-header-brand">
          <h1>TUPVLYMPICS '23</h1>
          <MenuIcon width={24} height={24} className="page-header-nav-toggle" onClick={this.toggleMenu} />
        </div>

        <nav className={ 'page-header-nav' + (menuToggled ? ' active' : '') }>
          <Link to="/" className={ page === 'homepage' ? 'active' : '' }>HOME</Link>
          <Link to="/schedules" className={ page === 'schedules' ? 'active' : '' }>SCHEDULES</Link>
          <Link to="/teams" className={ page === 'teams' ? 'active' : '' }>TEAMS</Link>
          <Link to="/brackets" className={ page === 'brackets' ? 'active' : '' }>BRACKETS</Link>
          <Link to="/admin" className={ 'page-header-nav-admin' + (page === 'admin' ? ' active' : '') }>
            <img src="/imgs/admin.png" alt="Admin access" width={32} height={32} />
            <span>ADMIN</span>
            <span>ACCESS</span>
          </Link>
        </nav>
      </header>
    );
  }
}

export default Header;
