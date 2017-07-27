const path = require("path");

const pluginTester = require("babel-plugin-tester");

const plugin = require("..");

pluginTester({
  plugin: plugin,
  fixtures: path.join(__dirname, "fixtures"),
});
