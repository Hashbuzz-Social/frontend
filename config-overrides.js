const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@components": path.resolve(__dirname, "src/components"),
    "@hooks": path.resolve(__dirname, "src/hooks"),
    "@svgr": path.resolve(__dirname, "src/SVGR"),
    "@wallet": path.resolve(__dirname, "src/Wallet"),
    "@store": path.resolve(__dirname, "src/Store"),
    "@componentsV2": path.resolve(__dirname, "src/Ver2Designs/Components"),
  })
);
