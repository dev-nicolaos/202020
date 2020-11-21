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

import { Banner, BannerClose, ControlBtn, RepeatCheckbox, Timer } from './elements.js';
import { BROWSER_SUPPORTS_NOTIFICATIONS, TWENTY_MINUTES } from './consts.js';

const hasNotificationsPermission = () =>
  BROWSER_SUPPORTS_NOTIFICATIONS && Notification.permission === "granted";

const sendNotification = () => {
  if (hasNotificationsPermission()) {
    new Notification("It's been 20 minutes, give your eyes a break!", {
      requireInteraction: !RepeatCheckbox.checked,
      body: "Look at something 20 feet away for 20 seconds to let your eyes relax",
    });
  }
};

/**
 * @param {Date} time
 * @returns {string}
 */
const formatTime = (time) => {
  const seconds = time.getSeconds();
  return `${time.getMinutes()}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

let COUNTING = false;

const reset = () => {
  ControlBtn.textContent = "Start";
  Timer.textContent = "20:00";
  COUNTING = false;
};

/**
 * @param {number} targetTimeStamp
 * @param {boolean} [firstRun=false]
 *  */
const countDown = (targetTimeStamp, firstRun = false) => {
  if (COUNTING) {
    const timeRemaining = new Date(targetTimeStamp - Date.now());

    if (timeRemaining.getTime() <= 0) {
      sendNotification();
      RepeatCheckbox.checked ? countDown(Date.now() + TWENTY_MINUTES) : reset();
    } else {
      if (firstRun) ControlBtn.textContent = "Reset";
      Timer.textContent = formatTime(timeRemaining);
      setTimeout(countDown, 200, targetTimeStamp);
    }
  }
};

const handleCloseBanner = async () => {
  Banner.classList.remove("show");
  await Notification.requestPermission();
  COUNTING = true;
  countDown(Date.now() + TWENTY_MINUTES, true);
};

const handleControlBtnClick = () => {
  if (COUNTING) {
    reset();
  } else {
    if (BROWSER_SUPPORTS_NOTIFICATIONS && !hasNotificationsPermission()) {
      Banner.classList.add("show");
    } else {
      COUNTING = true;
      countDown(Date.now() + TWENTY_MINUTES, true);
    }
  }
};

BannerClose.addEventListener('click', handleCloseBanner);
ControlBtn.addEventListener("click", handleControlBtnClick);
