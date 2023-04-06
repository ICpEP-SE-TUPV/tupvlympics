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
import Header from '../../components/Header';
import './style.scss';

interface HomepageProps {}

interface HomepageState {
  teams: Team[];
  categories: Category[];
}

class Homepage extends React.Component<HomepageProps, HomepageState> {
  constructor (props: HomepageProps) {
    super(props);

    this.state = {
      teams: [],
      categories: []
    };

    this.loadTeams = this.loadTeams.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
  }

  async loadTeams () {
    try {
      const backend = process.env.REACT_APP_BACKEND_API;
      const teamsRes = await axios.get(`${backend}/api/teams?sort=true&tabulation=true`);
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
        <Header page="homepage" />

        <main>
          <div className="homepage">
            <div className="homepage-lead">
              <h1>OVERALL STANDING OF TEAMS</h1>
              <p>Tallied based on the points equivalent per event. Tally is still tentative and might change based on the succeeding events until April 22, 2023.</p>
            </div>

            <div className="homepage-teams">
              { this.state.teams.map((team, i) => {
                return (
                  <div className="homepage-team px-5 mb-2" key={i}>
                    <img src={`${backend}/api/teams/${team.id}/logo`} alt={`${team.name} Logo`} width={120} height={120} />
                    <div className="homepage-team-pts">
                      <h3>{ team.score } pts</h3>
                      <p>{ team.name }</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="homepage-tabulation-container px-4">
            <h2>TABULATION OF SCORES</h2>
            <div className="homepage-tabulation-scroll">
              <table cellPadding={0} cellSpacing={0} className="homepage-tabulation my-5">
                <thead>
                  <tr>
                    <th></th>
                    { this.state.categories.map((categories, i) => {
                      return (
                        <th key={i}>{ categories.name }</th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  { this.state.teams.map((team, i) => {
                    return (
                      <tr key={i}>
                        <td><img src={`${backend}/api/teams/${team.id}/logo`} alt={`${team.name} Logo`} width={64} height={64} /></td>
                        { Array.isArray(team.tabulation) ? team.tabulation.map((tab, j) => {
                          return (
                            <td className="px-3" key={j}>
                              <div>{ tab }</div>
                            </td>
                          );
                        }) : '' }
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default Homepage;
