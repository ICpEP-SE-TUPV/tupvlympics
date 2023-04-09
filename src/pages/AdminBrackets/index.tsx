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

import { Category } from '../../types';
import './style.scss';

interface AdminBracketsProps {}

interface AdminBracketsState {
  category: string;
  categories: Category[];
  embed: string;
  error: string;
  submitting: boolean;
}

class AdminBrackets extends React.Component<AdminBracketsProps, AdminBracketsState> {
  constructor (props: AdminBracketsProps) {
    super(props);

    this.state = {
      category: '',
      categories: [],
      embed: '',
      error: '',
      submitting: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
    this.submitEmbed = this.submitEmbed.bind(this);
  }

  handleChange (event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const state = this.state as any;
    const name = target.name;
    const value = target.value;
    state[name] = value;
    this.setState(state);

    if (value !== '' && name === 'category') {
      const { categories, category } = this.state;
      const categoryN = parseInt(category);
      let current: Category | null = null;
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].id === categoryN) {
          current = categories[i];
          break;
        }
      }

      this.setState({ embed: current === null ? '' : current.embed });
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

  async submitEmbed (event: React.FormEvent) {
    event.preventDefault();

    this.setState({ error: '', submitting: true });

    const token = sessionStorage.getItem('token');
    if (token === null) return;

    const form = event.target as HTMLFormElement;
    const embed = this.state.embed;

    try {
      const res = await axios.post(form.action, { embed }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.success) {
        await this.loadCategories();
      } else {
        this.setState({ error: res.data.message });
      }
    } catch (error) {
      this.setState({ error: 'Unable to send request' });
    }

    this.setState({ error: '', submitting: false });
  }

  async componentDidMount () {
    await this.loadCategories();
  }

  render () {
    const backend = process.env.REACT_APP_BACKEND_API;
    return (
      <React.Fragment>
        <div className="card px-3 py-2 mb-3">
          <h3>BRACKETS</h3>
          <div className="form-group mb-2">
            <label htmlFor="brackets-category">Category:</label>
            <select id="brackets-category" name="category" className="form-control" defaultValue={this.state.category} onChange={this.handleChange}>
              <option value=""></option>
              { this.state.categories.map((category, i) => {
                return <option value={category.id} key={i}>{ category.name }</option>;
              })}
            </select>
          </div>
        </div>

        { this.state.embed !== '' &&
          <div dangerouslySetInnerHTML={{__html: this.state.embed}}></div>
        }

        { this.state.category !== '' &&
          <form action={`${backend}/api/categories/${this.state.category}/embed`} method="post" className="card px-3 py-2 mb-3" onSubmit={this.submitEmbed}>
            <h3>UPDATE BRACKET</h3>
            <div className="form-group mb-2">
              <label htmlFor="brackets-embed">Embed:</label>
              <input type="text" id="brackets-embed" name="embed" value={this.state.embed} className="form-control" autoComplete="off" onChange={this.handleChange} />
            </div>

            {
              this.state.error !== '' &&
              <div className="alert alert-error mb-3">
                { this.state.error }
              </div>
            }

            <button type="submit" className="btn btn-primary" disabled={this.state.submitting}>Submit</button>
          </form>
        }
      </React.Fragment>
    );
  }
}

export default AdminBrackets;
