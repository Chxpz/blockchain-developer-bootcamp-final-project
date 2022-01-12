const CryptogranaToken = artifacts.require("CryptogranaToken");

module.exports = function (deployer) {
  deployer.deploy(CryptogranaToken) 
};

  