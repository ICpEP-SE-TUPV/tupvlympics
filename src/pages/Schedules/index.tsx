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
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

import { Team, Schedule } from '../../types';
import Header from '../../components/Header';
import { formatDate } from '../../utils/date';
import './style.scss';

interface SchedulesProps {}

interface SchedulesState {
  teams: Team[];
  schedule: Schedule[];
}

class Schedules extends React.Component<SchedulesProps, SchedulesState> {
  constructor (props: SchedulesProps) {
    super(props);

    this.state = {
      teams: [],
      schedule: []
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

  async loadSchedule () {
    try {
      const backend = process.env.REACT_APP_BACKEND_API;
      const scheduleRes = await axios.get(`${backend}/api/schedule`)
      if (scheduleRes.data.success) {
        const schedule = scheduleRes.data.schedule;
        this.setState({ schedule });
      }
    } catch (error) {
      window.alert('Unable to fetch schedule');
    }
  }

  async componentDidMount () {
    await this.loadTeams();
    await this.loadSchedule();
  }

  render () {
    const backend = process.env.REACT_APP_BACKEND_API;
    return (
      <React.Fragment>
        <Header page="schedules" />

        <main>
          <div className="schedules-teams mt-5">
            { this.state.teams.map((team, i) => {
              return <img src={`${backend}/api/teams/${team.id}/logo`} alt={`${team.name} Logo`} width={100} height={100} className="mx-3" key={i} />;
            })}
          </div>

          <div className="schedules-list mt-5">
            { this.state.schedule.map((data, i) => {
              return (
                <div className="schedule-day-container mr-5 mb-3" key={i}>
                  <small>{ formatDate(data.date) }</small>
                  <div className="schedule-day py-3 px-2">
                    <ReactMarkdown>{ data.text }</ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default Schedules;
