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

const TWENTY_MINUTES = 1200000;
let COUNTDOWN_ID = null;

const padSeconds = (seconds) => seconds < 10 ? `0${seconds}` : seconds;
const hasPermission = () => Notification.permission === "granted";

const Timer = document.getElementById("timer");
const ControlBtn = document.getElementById("control");

const resetCountdown = () => {
  clearInterval(COUNTDOWN_ID);
  COUNTDOWN_ID = null;
  ControlBtn.textContent = "Start";
  Timer.textContent = "20:00";
};

const startCountdown = () => {
  ControlBtn.textContent = "Reset";
  let countdownTarget = Date.now() + TWENTY_MINUTES;

  return setInterval(() => {
    const countdownDiff = new Date(countdownTarget - Date.now());
    if (countdownDiff <= 0) {
      resetCountdown();
      if (hasPermission()) {
        new Notification("It's been 20 minutes, give your eyes a break!", {
          requireInteraction: true,
        });
      }
    } else {
      Timer.textContent = `${countdownDiff.getMinutes()}:${
        padSeconds(countdownDiff.getSeconds())
      }`;
    }
  }, 200);
};

const handleControlClick = async () => {
  if (COUNTDOWN_ID) {
    resetCountdown();
  } else {
    if (!hasPermission()) {
      await Notification.requestPermission();
    }
    COUNTDOWN_ID = startCountdown();
  }
};

ControlBtn.addEventListener("click", handleControlClick);
