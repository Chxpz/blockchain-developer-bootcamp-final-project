require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.pvt;
const oneMnemonic = process.env.OnePvt

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard BSC port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    bsctestnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-2-s3.binance.org:8545/`),
      network_id: 97,
      confirmations: 1,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    OneTestnet: {
      provider: () => {
        return new HDWalletProvider(
          oneMnemonic,
          'https://api.s0.b.hmny.io'
        );
      },
      network_id: 1666700000, // 1666600000 for mainnet
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.2", // A version or constraint - Ex. "^0.5.0"
    }
  }
}