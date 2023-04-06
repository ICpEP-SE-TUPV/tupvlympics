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

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function formatDate (dateStr: string, value: boolean = false) {
  const date = new Date(dateStr);
  const year = date.getFullYear().toString();

  if (!value) {
    const month = MONTHS[date.getMonth()];
    const day = date.getDate().toString();
    return `${month} ${day}, ${year}`;
  } else {
    let month = (date.getMonth() + 1).toString();
    while (month.length < 2) month = `0${month}`;
    let day = date.getDate().toString();
    while (day.length < 2) day = `0${day}`;
    return `${year}-${month}-${day}`;
  }
}
