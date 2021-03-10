<script>
  export let show;
</script>

<div class:show>
  We need your permission to notify you when it's time to take a break
</div>

<style>
  div {
    background: var(--black);
    border: 1px solid var(--white);
    border-radius: 0.25em;
    bottom: 2em;
    inline-size: max-content;
    left: 50%;
    line-height: 1.4;
    max-inline-size: 80%;
    padding: 1em;
    position: fixed;
    transform: translate(-50%, 10em);
    transition: transform 400ms;
  }

  div.show {
    transform: translate(-50%, 0);
  }
</style>
