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

interface AdminCategoriesProps {}

interface AdminCategoriesState {
  name: string;
  subs: string;
  error: string;
  adding: boolean;
  categories: Category[];
}

class AdminCategories extends React.Component<AdminCategoriesProps, AdminCategoriesState> {
  constructor (props: AdminCategoriesProps) {
    super(props);

    this.state = {
      name: '',
      subs: '',
      error: '',
      adding: false,
      categories: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
  }

  handleChange (event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const state = this.state as any;
    state[target.name] = target.value;
    this.setState(state);
  }

  async addCategory (event: React.FormEvent) {
    event.preventDefault();

    this.setState({ error: '', adding: true });

    const token = sessionStorage.getItem('token');
    if (token === null) return;

    const form = event.target as HTMLFormElement;
    const name = this.state.name;
    const subs = this.state.subs;

    try {
      const res = await axios.post(form.action, { name, subs }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.success) {
        await this.loadCategories();
        this.setState({ name: '', subs: '' });
      } else {
        this.setState({ error: res.data.message });
      }
    } catch (error) {
      this.setState({ error: 'Unable to send request' });
    }

    this.setState({ adding: false });
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

  removeCategory (id: number) {
    return async (event: React.MouseEvent) => {
      try {
        const backend = process.env.REACT_APP_BACKEND_API;
        const token = sessionStorage.getItem('token');
        if (token === null) return;

        const res = await axios.delete(`${backend}/api/categories/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (res.data.success) await this.loadCategories();
      } catch (error) {
        window.alert('Unable to remove category');
      }
    }
  }

  async componentDidMount () {
    await this.loadCategories();
  }

  render () {
    const backend = process.env.REACT_APP_BACKEND_API;
    const categories: React.ReactNode[] = [];
    for (let i = 0; i < this.state.categories.length; i++) {
      const category = this.state.categories[i];
      categories.push(
        <div className="admin-category my-2 mx-2 p-3" key={i}>
          <h3>{ category.maincategory !== '' ? category.maincategory : category.name }</h3>
          <button type="button" className="btn btn-secondary mt-2" onClick={this.removeCategory(category.id)}>Remove category</button>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className="card px-3 py-2 mb-3">
          <h3>CATEGORIES</h3>
          <div className="admin-categories">{ categories }</div>
        </div>

        <form action={`${backend}/api/categories`} method="post" className="card px-3 py-2" onSubmit={this.addCategory}>
          <h3 className="mb-3">Add new category</h3>

          <div className="form-group mb-2">
            <label htmlFor="category-name">Category:</label>
            <input type="text" id="category-name" name="name" value={this.state.name} className="form-control" autoComplete="off" onChange={this.handleChange} required />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="category-subs">Subcategories (comma-separated) (Optional):</label>
            <input type="text" id="category-subs" name="subs" value={this.state.subs} className="form-control" autoComplete="off" onChange={this.handleChange} />
          </div>

          {
            this.state.error !== '' &&
            <div className="alert alert-error mb-3">
              { this.state.error }
            </div>
          }

          <button type="submit" className="btn btn-primary" disabled={this.state.adding}>Submit</button>
        </form>
      </React.Fragment>
    );
  }
}

export default AdminCategories;
