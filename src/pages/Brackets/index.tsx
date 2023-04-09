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

import Header from '../../components/Header';
import { Category } from '../../types';
import './style.scss';

interface BracketsProps {}

interface BracketsState {
  categories: Category[];
  active: number;
}

class Brackets extends React.Component<BracketsProps, BracketsState> {
  constructor (props: BracketsProps) {
    super(props);

    this.state = {
      categories: [],
      active: 0
    };

    this.loadCategories = this.loadCategories.bind(this);
    this.nav = this.nav.bind(this);
  }

  async loadCategories () {
    try {
      const backend = process.env.REACT_APP_BACKEND_API;
      const categoriesRes = await axios.get(`${backend}/api/categories?embed`);
      if (categoriesRes.data.success) {
        const categories = categoriesRes.data.categories;
        this.setState({ categories });
      }
    } catch (error) {
      window.alert('Unable to fetch categories');
    }
  }

  nav (index: number) {
    return (event: React.MouseEvent) => {
      this.setState({ active: index });
    }
  }

  async componentDidMount () {
    await this.loadCategories();
  }

  render () {
    return (
      <React.Fragment>
        <Header page="brackets" />

        <main className="brackets-main p-5">
          <div className="brackets-nav mx-3">
            { this.state.categories.map((category, i) => {
              return <button type="button" className={'bracket-btn my-1' + (this.state.active == i ? ' active' : '')} onClick={this.nav(i)} key={i}>{ category.name }</button>;
            })}
          </div>

          { this.state.categories.length > 0 &&
            <div className="brackets-bracket" dangerouslySetInnerHTML={{__html: this.state.categories[this.state.active].embed}}></div>
          }
        </main>
      </React.Fragment>
    );
  }
}

export default Brackets;
