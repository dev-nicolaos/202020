/*
  20-20-20: A simple web app that reminds you to give your eyes a break
  Copyright (C) 2020 Nicolaos Skimas

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/** @type {HTMLElement} */
export const Banner = document.querySelector(".banner");

/** @type {HTMLButtonElement} */
export const BannerClose = document.querySelector(".banner_close");

/** @type {HTMLlement} */
export const Timer = document.querySelector(".countdown_timer");

/** @type {HTMLButtonElement} */
export const ControlBtn = document.querySelector("#control");

/** @type {HTMLInputElement} */
export const RepeatCheckbox = document.querySelector("input[type=checkbox][name=repeat]");
