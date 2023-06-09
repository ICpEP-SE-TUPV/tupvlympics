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

export interface Team {
  id: number;
  name: string;
  courses: string;
  score: number;
  tabulation?: number[];
}

export interface Category {
  id: number;
  name: string;
  maincategory: string;
  embed: string;
}

export interface CategoryBracket {
  ids: number[];
  name: '',
  subs: string[];
  embed: string[] | string;
}

export interface Schedule {
  id: number;
  date: string;
  text: string;
}
