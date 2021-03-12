<script>
  export let show;
  export let handleNo;
  export let handleYes;
</script>

<div aria-hidden={!show}>
  <span>Want to be notified when it's time to let your eyes rest?</span>
  <button class="button secondary" on:click={handleNo} type="button">No</button>
  <button class="button" on:click={handleYes} type="button">Yes</button>
</div>

<style>
  div {
    background: var(--black);
    border: 1px solid var(--white);
    border-radius: 0.25em;
    bottom: 2em;
    display: grid;
    gap: 1em;
    inline-size: max-content;
    left: 50%;
    line-height: 1.4;
    max-inline-size: 80%;
    padding: 1em;
    position: fixed;
    transform: translate(-50%, 0);
    transition: transform 300ms;
  }

  @media (min-width: 480px) {
    div {
      align-items: center;
      grid-auto-flow: column;
    }
  }

  div[aria-hidden="true"] {
    transform: translate(-50%, 20em);
  }

  span {
    line-height: 1.2;
  }
</style>
