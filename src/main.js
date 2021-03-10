import App from "./App.svelte";

const countdownTarget = document.getElementById("countdown-target");
new App({ target: countdownTarget });
countdownTarget.classList.remove("loading");

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('ServiceWorker registration successful with scope:', reg.scope))
    .catch(err => console.warn('ServiceWorker registration failed:', err));
}
