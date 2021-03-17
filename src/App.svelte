<script>
  import {
    cancelNotification,
    requestPermission,
    scheduleNotification,
  } from "./notifications";
  import { formatTime, THIRTY_SECONDS, TWENTY_MINUTES } from "./time";
  import NotificationPrompt from "./NotificationPrompt.svelte";

  // STATE
  let frameId;
  let hasSeenNotificationPrompt = false;
  let shouldRepeat = false;
  let showingNotificationPrompt = false;
  let timeRemaining = TWENTY_MINUTES;
  $: counting = !(timeRemaining === TWENTY_MINUTES);
  $: formattedTime = formatTime(timeRemaining);
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
    timeRemaining = TWENTY_MINUTES;
  };

  const startCountdown = () => {
    const targetTime = performance.now() + TWENTY_MINUTES;

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
</script>

<div
  aria-label={`${formattedTime[0]} minutes and ${formattedTime[1]} seconds remaining`}
  aria-live={counting && timeRemaining % THIRTY_SECONDS < 1000
    ? "polite"
    : "off"}
  class="countdown_timer"
  role="timer"
>
  {formattedTime.join(":")}
</div>
<button
  aria-label={`${counting ? "Reset" : "Start"} countdown`}
  class="button"
  on:click={handleClick}
  type="button"
>
  {counting ? "Reset" : "Start"}
</button>
{#if showingNotificationPrompt}
  <NotificationPrompt
    handleNo={hideNotificationPrompt}
    handleYes={handleWantsNotifications}
  />
{/if}
<label class="countdown_auto-repeat">
  Auto repeat countdown
  <input bind:checked={shouldRepeat} type="checkbox" class="checkbox" />
</label>

<style>
  .countdown_timer {
    font-size: 5rem;
    font-weight: bold;
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
