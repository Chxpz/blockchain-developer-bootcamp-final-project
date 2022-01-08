const OptionDex = artifacts.require("OptionDex");

module.exports = function (deployer) {
  deployer.deploy(OptionDex);
};
