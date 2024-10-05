const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@components": path.resolve(__dirname, "src/components"),
    "@hooks": path.resolve(__dirname, "src/hooks"),
    "@svgr": path.resolve(__dirname, "src/SVGR"),
    "@wallet": path.resolve(__dirname, "src/Wallet"),
  })
);
