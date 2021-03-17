module.exports = {
  mount: { public: '/', src: '/dist' },
  plugins: ['@snowpack/plugin-svelte'],
  optimize: { bundle: true, minify: true },
};
