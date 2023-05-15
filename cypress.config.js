const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return {
        video: false,
        screenshotOnRunFailure: false,
      }
    },
  }
});
