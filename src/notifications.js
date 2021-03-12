const SUPPORTS_NOTIFICATIONS = "Notification" in window;

/**
 * The callback usage of Notification.requestPermission is deprecated,
 * but at the moment it is still supported by all major browsers,
 * while promise based usage is not supported in Safari,
 * so for now will just promisify the callback approach.
 */

// TODO: Remove this wrapper and natively await Notification.requestPermission() when Safari supports it
export const requestPermission = () =>
  new Promise((resolve) => {
    Notification.requestPermission((permission) => {
      resolve(permission);
    });
  });

/**
 * @param {number} targetTime
 * @returns {boolean} Should ask for permission
 */
export const scheduleNotification = (targetTime) => {
  if (SUPPORTS_NOTIFICATIONS && Notification.permission !== "denied") {
    if (Notification.permission === "granted") {
      fetch("notifyServiceWorker", {
        method: "POST",
        body: targetTime - performance.now(),
      });
      return false;
    }
    return true;
  }
  return false;
};

export const cancelNotification = () => {
  if (SUPPORTS_NOTIFICATIONS) {
    fetch("notifyServiceWorker", { method: "DELETE" });
  }
};
