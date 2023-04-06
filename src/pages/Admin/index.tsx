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
import axios from 'axios';

import Header from '../../components/Header';
import './style.scss';

interface AdminWrapProps {}

interface AdminProps extends AdminWrapProps {
  navigate: NavigateFunction;
}

interface AdminState {
  username: string;
  password: string;
  error: string;
  loggingin: boolean;
}

class Admin extends React.Component<AdminProps, AdminState> {
  constructor (props: AdminProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: '',
      loggingin: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const state = this.state as any;
    const name = target.name;
    const value = target.value;
    state[name] = value;
    this.setState(state);
  }

  async handleSubmit (event: React.FormEvent) {
    event.preventDefault();

    this.setState({
      error: '',
      loggingin: true
    });

    const form = event.target as HTMLFormElement;
    const username = this.state.username;
    const password = this.state.password;
    try {
      const res = await axios.post(form.action, { username, password });
      if (res.data.success) {
        sessionStorage.setItem('token', res.data.token);
        this.props.navigate('/admin/dashboard');
      } else {
        this.setState({ error: res.data.message });
      }
    } catch (error) {
      this.setState({ error: 'Unable to send request' });
    }

    this.setState({ loggingin: false });
  }

  render () {
    const api = process.env.REACT_APP_BACKEND_API;
    const token = sessionStorage.getItem('token');
    if (token !== null) return <Navigate to="/admin/dashboard" />;

    return (
      <React.Fragment>
        <Header page="admin" />

        <main>
          <form action={`${api}/api/login`} method="post" className="card form-login px-4 py-3" onSubmit={this.handleSubmit}>
            <h2>ADMIN ACCESS</h2>

            <div className="form-group mb-3">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" value={this.state.username} className="form-control" autoComplete="off" onChange={this.handleChange} required />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" value={this.state.password} className="form-control" autoComplete="off" onChange={this.handleChange} required />
            </div>

            {
              this.state.error !== '' &&
              <div className="alert alert-error mb-3">
                { this.state.error }
              </div>
            }

            <button type="submit" className="btn btn-block btn-primary" disabled={this.state.loggingin}>LOG IN</button>
          </form>
        </main>
      </React.Fragment>
    );
  }
}

export default function AdminWrap (props: AdminWrapProps) {
  const navigate = useNavigate();
  return <Admin navigate={navigate} />;
}
