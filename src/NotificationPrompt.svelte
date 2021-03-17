<script>
  import { fly } from "svelte/transition";
  export let handleNo;
  export let handleYes;
</script>

<div transition:fly={{ y: 200 }}>
  <span>Want to be notified when it's time to let your eyes rest?</span>
  <button class="button secondary" on:click={handleNo} type="button">No</button>
  <button class="button" on:click={handleYes} type="button">Yes</button>
</div>

<style>
  div {
    background: var(--black);
    border: 1px solid var(--white);
    border-radius: var(--default-border-radius);
    bottom: 2em;
    inset-block-end: 2em;
    display: grid;
    gap: 1em;
    inline-size: max-content;
    left: 50%;
    inset-inline-start: 50%;
    line-height: 1.4;
    max-inline-size: 80%;
    padding: 1em;
    position: fixed;
    transform: translateX(-50%);
    transition: transform 300ms;
  }

  @media (min-width: 480px) {
    div {
      align-items: center;
      grid-auto-flow: column;
    }
  }

  span {
    line-height: 1.2;
  }
</style>
