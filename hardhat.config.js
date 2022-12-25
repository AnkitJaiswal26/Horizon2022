require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.17",
	networks: {
		hardhat: {
			allowUnlimitedContractSize: true,
			chainId: 1337,
		},
		polygon_mumbai: {
			url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_RPC_URL}`,
			accounts: [`0x${process.env.REACT_APP_PRIVATE_KEY}`],
			allowUnlimitedContractSize: true,
		},
	},
};
