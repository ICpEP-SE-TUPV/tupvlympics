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
import axios from 'axios';

import { Team } from '../../types';
import './style.scss';

interface AdminTeamsProps {}

interface AdminTeamsState {
  teams: Team[];
  logo: File | null;
  id: number;
  name: string;
  courses: string;
  error: string;
  adding: boolean;
  editing: boolean;
}

class AdminTeams extends React.Component<AdminTeamsProps, AdminTeamsState> {
  constructor (props: AdminTeamsProps) {
    super(props);

    this.state = {
      teams: [],
      logo: null,
      id: 0,
      name: '',
      courses: '',
      error: '',
      adding: false,
      editing: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.addTeam = this.addTeam.bind(this);
    this.edit = this.edit.bind(this);
    this.editTeam = this.editTeam.bind(this);
  }

  handleChange (event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const state = this.state as any;
    if (target.type === 'file') {
      const files = target.files;
      if (files === null || files.length === 0) {
        this.setState({ logo: null });
        return;
      }

      state[target.name] = files[0];
    } else {
      state[target.name] = target.value;
    }

    this.setState(state);
  }

  async addTeam (event: React.FormEvent) {
    event.preventDefault();

    this.setState({ error: '', adding: true });

    const token = sessionStorage.getItem('token');
    if (token === null) return;

    const form = event.target as HTMLFormElement;
    const logo = this.state.logo;
    const name = this.state.name;
    const courses = this.state.courses;

    if (logo === null) return;
    const formData = new FormData();
    formData.set('logo', logo);
    formData.set('name', name);
    formData.set('courses', courses);

    try {
      const res = await axios.post(form.action, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.success) {
        await this.loadTeams();
        this.setState({
          logo: null,
          name: '',
          courses: ''
        });
      } else {
        this.setState({ error: res.data.message });
      }
    } catch (error) {
      this.setState({ error: 'Unable to send request' });
    }

    this.setState({ adding: false });
  }

  async editTeam (event: React.MouseEvent) {
    event.preventDefault();

    this.setState({ error: '', editing: true });

    const token = sessionStorage.getItem('token');
    if (token === null) return;

    const backend = process.env.REACT_APP_BACKEND_API;
    const logo = this.state.logo;
    const id = this.state.id;
    const name = this.state.name;
    const courses = this.state.courses;

    const formData = new FormData();
    if (logo) formData.set('logo', logo);
    formData.set('name', name);
    formData.set('courses', courses);

    try {
      const res = await axios.post(`${backend}/api/teams/${id}`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.success) {
        await this.loadTeams();
        this.setState({
          logo: null,
          name: '',
          courses: ''
        });
      } else {
        this.setState({ error: res.data.message });
      }
    } catch (error) {
      this.setState({ error: 'Unable to send request' });
    }

    this.setState({ editing: false });
  }

  edit (index: number) {
    return (event: React.MouseEvent) => {
      const team = this.state.teams[index];
      this.setState({
        logo: null,
        id: team.id,
        name: team.name,
        courses: team.courses
      });
    }
  }

  removeTeam (id: number) {
    return async (event: React.MouseEvent) => {
      try {
        const backend = process.env.REACT_APP_BACKEND_API;
        const token = sessionStorage.getItem('token');
        if (token === null) return;

        const res = await axios.delete(`${backend}/api/teams/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (res.data.success) await this.loadTeams();
      } catch (error) {
        window.alert('Unable to remove team');
      }
    }
  }

  async loadTeams () {
    try {
      const backend = process.env.REACT_APP_BACKEND_API;
      const teamsRes = await axios.get(`${backend}/api/teams`);
      if (teamsRes.data.success) {
        const teams = teamsRes.data.teams;
        this.setState({ teams });
      }
    } catch (error) {
      window.alert('Unable to fetch teams');
    }
  }

  async componentDidMount () {
    await this.loadTeams();
  }

  render () {
    const backend = process.env.REACT_APP_BACKEND_API;
    const teams: React.ReactNode[] = [];
    for (let i = 0; i < this.state.teams.length; i++) {
      const team = this.state.teams[i];
      teams.push(
        <div className="admin-team mt-3" key={i}>
          <img src={`${backend}/api/teams/${team.id}/logo`} alt={`${team.name} Logo`} width={100} height={100} className="mr-3" />
          <div className="px-2">
            <h3>{ team.name }</h3>
            <p>{ team.courses }</p>
            <button type="button" className="btn btn-primary mr-2" onClick={this.edit(i)}>Edit</button>
            <button type="button" className="btn btn-secondary mt-2" onClick={this.removeTeam(team.id)}>Remove team</button>
          </div>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className="card px-3 py-2 mb-3">
          <h3>TEAMS</h3>
          <div className="admin-teams">{ teams }</div>
        </div>

        <form action={`${backend}/api/teams`} method="post" className="card px-3 py-2" onSubmit={this.addTeam}>
          <h3 className="mb-3">Add new team</h3>
          
          <div className="form-group mb-2">
            <label htmlFor="team-logo">Team Logo:</label>
            <input type="file" id="team-logo" name="logo" className="form-control" onChange={this.handleChange} required />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="team-name">Team Name:</label>
            <input type="text" id="team-name" name="name" value={this.state.name} className="form-control" autoComplete="off" onChange={this.handleChange} required />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="team-courses">Team Courses:</label>
            <textarea id="team-courses" name="courses" value={this.state.courses} className="form-control" autoComplete="off" onChange={this.handleChange} required />
          </div>

          {
            this.state.error !== '' &&
            <div className="alert alert-error mb-3">
              { this.state.error }
            </div>
          }

          <button type="submit" className="btn btn-primary mr-2" disabled={this.state.adding}>Submit</button>
          <button type="button" className="btn btn-secondary" disabled={this.state.editing} onClick={this.editTeam}>Edit</button>
        </form>
      </React.Fragment>
    );
  }
}

export default AdminTeams;
