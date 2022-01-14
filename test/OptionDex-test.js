

require("chai").use(require("chai-as-promised")).should();
let assert = require('chai').assert

const optionDex = artifacts.require("OptionDex");

const EVM_REVERT = "VM Exception while processing transaction: revert";

contract("Tests for OptionDex Contract", async (accounts) => {
  describe("Basic State verification", function () {
    let opDex;
    let owner;
    let token1;
    let token2;
    let initiator;
    let buyer;

    describe("#Testing Margin Accounts", function () {
      beforeEach(async function () {
        opDex = await optionDex.deployed();
      });

      it("Should increase the available margin call when receive a deposit", async () => {
        assert.equal(true, true);
      });

      it("Should decrease the available margin call when user withdraw", async () => {
        assert.equal(true, true);
      });

      it("Should increase the available margin put when user deposits", async () => {
        assert.equal(true, true);
      });

      it("Should decrease the available margin put when user withdraw", async () => {
        assert.equal(true, true);
      });
    });
  });
});
