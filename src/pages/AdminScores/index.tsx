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

import { Team, Category } from '../../types';

interface AdminScoresProps {}

interface AdminScoresState {
  team: string;
  category: string;
  score: string;
  error: string;
  getting: boolean;
  setting: boolean;
  teams: Team[];
  categories: Category[];
}

class AdminScores extends React.Component<AdminScoresProps, AdminScoresState> {
  constructor (props: AdminScoresProps) {
    super(props);

    this.state = {
      team: '',
      category: '',
      score: '',
      error: '',
      getting: false,
      setting: false,
      teams: [],
      categories: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.getScore = this.getScore.bind(this);
    this.setScore = this.setScore.bind(this);
    this.loadTeams = this.loadTeams.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
  }

  handleChange (event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const state = this.state as any;
    state[target.name] = target.value;
    this.setState(state);
  }

  async getScore (event: React.MouseEvent) {
    this.setState({ error: '', getting: true });

    const backend = process.env.REACT_APP_BACKEND_API;
    const team = this.state.team;
    const category = this.state.category;

    try {
      const res = await axios.get(`${backend}/api/scores/${team}/${category}`);
      if (res.data.success) {
        this.setState({ score: res.data.score });
      } else {
        this.setState({ error: res.data.message });
      }
    } catch (error) {
      this.setState({ error: 'Unable to send request' });
    }

    this.setState({ getting: false });
  }

  async setScore (event: React.FormEvent) {
    event.preventDefault();

    this.setState({ error: '', setting: true });

    const token = sessionStorage.getItem('token');
    if (token === null) return;

    const form = event.target as HTMLFormElement;
    const team = this.state.team;
    const category = this.state.category;
    const score = this.state.score;

    try {
      await axios.post(`${form.action}/${team}/${category}`, { score }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      this.setState({ error: 'Unable to send request' });
    }

    this.setState({ setting: false });
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

  async loadCategories () {
    try {
      const backend = process.env.REACT_APP_BACKEND_API;
      const categoriesRes = await axios.get(`${backend}/api/categories`);
      if (categoriesRes.data.success) {
        const categories = categoriesRes.data.categories;
        this.setState({ categories });
      }
    } catch (error) {
      window.alert('Unable to fetch categories');
    }
  }

  async componentDidMount () {
    await this.loadTeams();
    await this.loadCategories();
  }

  render () {
    const backend = process.env.REACT_APP_BACKEND_API;

    return (
      <React.Fragment>
        <form action={`${backend}/api/scores`} method="post" className="card px-3 py-2" onSubmit={this.setScore}>
          <h3 className="mb-2">SCORES</h3>

          <div className="form-group mb-2">
            <label htmlFor="score-team-name">Team:</label>
            <select id="score-team-name" name="team" className="form-control" defaultValue={this.state.team} onChange={this.handleChange} required>
              <option value=""></option>
              {
                this.state.teams.map(team => {
                  return <option value={team.id} key={team.id}>{ team.name }</option>;
                })
              }
            </select>
          </div>

          <div className="form-group mb-2">
            <label htmlFor="score-category-name">Category:</label>
            <select id="score-category-name" name="category" className="form-control" defaultValue={this.state.category} onChange={this.handleChange} required>
              <option value=""></option>
              {
                this.state.categories.map((category, i) => {
                  return <option value={category.id} key={i}>{ category.maincategory }</option>;
                })
              }
            </select>
          </div>

          <div className="form-group mb-2">
            <label htmlFor="team-category-score">Score:</label>
            <input type="number" id="team-category-score" name="score" value={this.state.score} className="form-control" autoComplete="off" onChange={this.handleChange} required />
          </div>

          {
            this.state.error !== '' &&
            <div className="alert alert-error mb-3">
              { this.state.error }
            </div>
          }

          <button type="button" className="btn btn-primary mr-2" disabled={this.state.getting} onClick={this.getScore}>Get Score</button>
          <button type="submit" className="btn btn-primary" disabled={this.state.setting}>Set Score</button>
        </form>
      </React.Fragment>
    );
  }
}

export default AdminScores;
