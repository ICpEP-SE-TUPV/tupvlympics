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
import Header from '../../components/Header';
import './style.scss';

interface TeamsProps {}

interface TeamsState {
  teams: Team[];
}

class Teams extends React.Component<TeamsProps, TeamsState> {
  constructor (props: TeamsProps) {
    super(props);

    this.state = {
      teams: []
    };

    this.loadTeams = this.loadTeams.bind(this);
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
    return (
      <React.Fragment>
        <Header page="teams" />

        <main className="teams-main">
          { this.state.teams.map((team, i) => {
            return (
              <div className="teams-team mt-5" key={i}>
                <img src={`${backend}/api/teams/${team.id}/logo`} alt={`${team.name} Logo`} width={200} height={200} />
                <div className="teams-team-details">
                  <h2>{ team.name }</h2>
                  <p className="px-5">{ team.courses }</p>
                </div>
              </div>
            );
          })}
        </main>
      </React.Fragment>
    );
  }
}

export default Teams;
