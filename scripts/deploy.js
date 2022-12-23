const hre = require("hardhat");

async function main() {
	const NFTTicket = await hre.ethers.getContractFactory("NFTTicket");
	const nFTTicket = await NFTTicket.deploy();

	await nFTTicket.deployed();

	console.log(`Deployed contract address ${nFTTicket.address}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
