/**
 * Requests permission to show notifications. Only runs if the user hasn't already made an explicit decision.
 * @param {function} action - called if permission is/has been granted
 * @param {function} setup - called prior to requesting permission
 * @param {function} cleanup - called after the user interacts with the prompt
 */
export const requestNotificationsPermission = async (action, setup, cleanup) => {
  if (Notification.permission !== "denied") {
    if (Notification.permission === "granted") {
      action();
    } else {
      setup();
      const afterPrompt = (permission) => {
        if (permission === "granted") action();
        cleanup();
      };
      // TODO: rm callback usage when Safari supports the promise version of requestPermission
      const maybePromise = Notification.requestPermission(afterPrompt);
      if (maybePromise.then) {
        afterPrompt(await maybePromise);
      }
    }
  }
};
