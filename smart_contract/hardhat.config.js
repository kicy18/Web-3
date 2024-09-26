//https://eth-sepolia.g.alchemy.com/v2/xPzzkRXQ_sRBb8tlGrEwA4_vz0D6ywaD



require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity:'0.8.27',
  networks:{
    sepolia:{
      url:'https://eth-sepolia.g.alchemy.com/v2/xPzzkRXQ_sRBb8tlGrEwA4_vz0D6ywaD',
      accounts : ['b9e5401f94f87f88695d6a46a7a4e64b7ebc5d12d1eb9a25e2bf76e22c845ce1']
    }

  }
}
