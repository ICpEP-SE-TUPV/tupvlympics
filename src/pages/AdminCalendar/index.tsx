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

import { Schedule } from '../../types';
import { formatDate } from '../../utils/date';
import './style.scss';

interface AdminCalendarProps {}

interface AdminCalendarState {
  id: string;
  date: string;
  text: string;
  error: string;
  adding: boolean;
  editing: boolean;
  schedule: Schedule[];
}

class AdminCalendar extends React.Component<AdminCalendarProps, AdminCalendarState> {
  constructor (props: AdminCalendarProps) {
    super(props);

    this.state = {
      id: '',
      date: '',
      text: '',
      error: '',
      adding: false,
      editing: false,
      schedule: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.addSchedule = this.addSchedule.bind(this);
    this.editSchedule = this.editSchedule.bind(this);
    this.edit = this.edit.bind(this);
  }

  handleChange (event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const state = this.state as any;
    state[target.name] = target.value;
    this.setState(state);
  }

  async addSchedule (event: React.FormEvent) {
    event.preventDefault();

    this.setState({ error: '', adding: true });

    const token = sessionStorage.getItem('token');
    if (token === null) return;

    const form = event.target as HTMLFormElement;
    const date = this.state.date;
    const text = this.state.text;

    try {
      const res = await axios.post(form.action, { text, date }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.success) {
        await this.loadSchedule();
        this.setState({ text: '', date: '' });
      } else {
        this.setState({ error: res.data.message });
      }
    } catch (error) {
      this.setState({ error: 'Unable to send request' });
    }

    this.setState({ adding: false });
  }

  edit (index: number) {
    return (event: React.MouseEvent) => {
      const day = this.state.schedule[index];
      this.setState({
        id: day.id,
        date: formatDate(day.date, true),
        text: day.text
      });
    }
  }

  remove (index: number) {
    return async (event: React.MouseEvent) => {
      const token = sessionStorage.getItem('token');
      if (token === null) return;

      const backend = process.env.REACT_APP_BACKEND_API;
      const id = this.state.schedule[index].id;
      try {
        const res = await axios.delete(`${backend}/api/schedule/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
  
        if (res.data.success) {
          await this.loadSchedule();
        } else {
          this.setState({ error: res.data.message });
        }
      } catch (error) {
        this.setState({ error: 'Unable to send request' });
      }
    }
  }

  async editSchedule (event: React.MouseEvent) {
    event.preventDefault();

    this.setState({ error: '', editing: true });

    const token = sessionStorage.getItem('token');
    if (token === null) return;

    const backend = process.env.REACT_APP_BACKEND_API;
    const id = this.state.id;
    const date = this.state.date;
    const text = this.state.text;
    if (id === '') return;

    try {
      const res = await axios.post(`${backend}/api/schedule/${id}`, { text, date }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.success) {
        await this.loadSchedule();
        this.setState({ text: '', date: '' });
      } else {
        this.setState({ error: res.data.message });
      }
    } catch (error) {
      this.setState({ error: 'Unable to send request' });
    }

    this.setState({ editing: false });
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
    await this.loadSchedule();
  }

  render () {
    const backend = process.env.REACT_APP_BACKEND_API;
    return (
      <React.Fragment>
        <div className="card px-3 py-2 mb-3">
          <h3>SCHEDULE</h3>
          <div className="schedule-list">
            { this.state.schedule.map((data, i) => {
              return (
                <div className="schedule-day-container mr-3" key={i}>
                  <small>{ formatDate(data.date) }</small>
                  <div className="schedule-day py-3 px-2">
                    <ReactMarkdown>{ data.text }</ReactMarkdown>
                    <button type="button" className="btn btn-primary mt-3 mr-2" onClick={this.edit(i)}>Edit</button>
                    <button type="button" className="btn btn-secondary mt-3" onClick={this.remove(i)}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form action={`${backend}/api/schedule`} method="post" className="card px-3 py-2" onSubmit={this.addSchedule}>
          <h3 className="mb-3">Add/edit new schedule</h3>

          <div className="form-group mb-2">
            <label htmlFor="schedule-date">Date:</label>
            <input type="date" id="schedule-date" name="date" value={this.state.date} className="form-control" autoComplete="off" onChange={this.handleChange} required />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="schedule-text">Text (Markdown supported):</label>
            <textarea id="schedule-text" name="text" value={this.state.text} rows={7} className="form-control" onChange={this.handleChange} required />
          </div>

          {
            this.state.error !== '' &&
            <div className="alert alert-error mb-3">
              { this.state.error }
            </div>
          }

          <button type="submit" className="btn btn-primary mr-3" disabled={this.state.adding}>Submit</button>
          <button type="button" className="btn btn-secondary" disabled={this.state.editing} onClick={this.editSchedule}>Edit</button>
        </form>
      </React.Fragment>
    );
  }
}

export default AdminCalendar;
