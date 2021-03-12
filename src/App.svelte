<script>
  import {
    cancelNotification,
    requestPermission,
    scheduleNotification,
  } from "./notifications";
  import NotificationPrompt from "./NotificationPrompt.svelte";

  const TWENTY_MINUTES_IN_MILLISECONDS = 1200000;

  // STATE
  let frameId;
  let hasSeenNotificationPrompt = false;
  let shouldRepeat = false;
  let showingNotificationPrompt = false;
  let timeRemaining = TWENTY_MINUTES_IN_MILLISECONDS;
  $: counting = !(timeRemaining === TWENTY_MINUTES_IN_MILLISECONDS);
  // END STATE

  const hideNotificationPrompt = () => {
    showingNotificationPrompt = false;
  };

  const handleWantsNotifications = async () => {
    hideNotificationPrompt();
    const permissionGranted = (await requestPermission()) == "granted";
    if (permissionGranted && counting) scheduleNotification(timeRemaining);
  };

  const resetCountdown = () => {
    cancelNotification();
    cancelAnimationFrame(frameId);
    timeRemaining = TWENTY_MINUTES_IN_MILLISECONDS;
  };

  const startCountdown = () => {
    const targetTime = performance.now() + TWENTY_MINUTES_IN_MILLISECONDS;

    if (scheduleNotification(targetTime) && !hasSeenNotificationPrompt) {
      showingNotificationPrompt = true;
      hasSeenNotificationPrompt = true;
    }

    const count = () => {
      const diffMS = targetTime - performance.now();
      if (diffMS > 0) {
        timeRemaining = diffMS;
        frameId = requestAnimationFrame(count);
      } else if (shouldRepeat) {
        startCountdown();
      } else {
        resetCountdown();
      }
    };

    frameId = requestAnimationFrame(count);
  };

  const handleClick = () => {
    if (counting) {
      resetCountdown();
    } else {
      startCountdown();
    }
  };

  /**
   * @param {number} time
   * @returns {string}
   */
  const formatTime = (time) => {
    const formattingDate = new Date(time);
    const seconds = formattingDate.getSeconds();
    return `${formattingDate.getMinutes()}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  };
</script>

<main class="countdown">
  <div class="countdown_timer">{formatTime(timeRemaining)}</div>
  <button class="button" on:click={handleClick} type="button">
    {counting ? "Reset" : "Start"}
  </button>
  <label class="countdown_auto-repeat">
    Auto repeat countdown
    <input bind:checked={shouldRepeat} type="checkbox" class="checkbox" />
  </label>
</main>

<NotificationPrompt
  show={showingNotificationPrompt}
  handleNo={hideNotificationPrompt}
  handleYes={handleWantsNotifications}
/>

<style>
  .countdown {
    /* TODO: use flex once gap in flex has enough support */
    display: grid;
    gap: 2em;
    justify-items: center;
  }

  .countdown_timer {
    font-size: 6rem;
  }

  .button {
    font-size: 1.5rem;
  }

  .countdown_auto-repeat {
    align-items: center;
    cursor: pointer;
    /* TODO: use flex once gap in flex has enough support */
    display: grid;
    gap: 0.8em;
    grid-auto-flow: column;
    padding: 0.5em;
  }
</style>
