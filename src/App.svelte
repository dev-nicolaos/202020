<script>
  const TWENTY_MINUTES_IN_MILLISECONDS = 1200000;

  let timeRemaining = TWENTY_MINUTES_IN_MILLISECONDS;
  $: counting = !(timeRemaining === TWENTY_MINUTES_IN_MILLISECONDS);
  let shouldRepeat = false;
  let frameId;

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

  const sendNotification = () => {
    if (Notification && Notification.permission === "granted") {
      new Notification("It's been 20 minutes, give your eyes a break!", {
        requireInteraction: !shouldRepeat,
        body:
          "Look at something 20 feet away for 20 seconds to let your eyes relax",
      });
    }
  };

  const resetCountdown = () => {
    cancelAnimationFrame(frameId);
    timeRemaining = TWENTY_MINUTES_IN_MILLISECONDS;
  };

  const startCountdown = () => {
    const targetTime = performance.now() + TWENTY_MINUTES_IN_MILLISECONDS;

    const count = () => {
      const diffMS = targetTime - performance.now();
      if (diffMS > 0) {
        timeRemaining = diffMS;
        frameId = requestAnimationFrame(count);
      } else if (shouldRepeat) {
        sendNotification();
        startCountdown();
      } else {
        sendNotification();
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
      if (Notification) Notification.requestPermission();
    }
  };
</script>

<main class="countdown">
  <div class="countdown_timer">{formatTime(timeRemaining)}</div>
  <button on:click={handleClick} class="button">
    {counting ? "Reset" : "Start"}
  </button>
  <label class="countdown_auto-repeat">
    Auto repeat countdown
    <input bind:checked={shouldRepeat} type="checkbox" class="checkbox" />
  </label>
</main>

<style>
  .countdown {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2em;
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
    display: flex;
    gap: 0.8em;
    padding: 0.5em;
  }
</style>
