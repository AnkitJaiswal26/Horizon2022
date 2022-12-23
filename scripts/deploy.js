const hre = require("hardhat");

async function main() {
	const EventTicketsFactory = await hre.ethers.getContractFactory(
		"EventTicketsFactory"
	);
	const eventTicketsFactory = await EventTicketsFactory.deploy();

	const EventToken = await hre.ethers.getContractFactory("EventToken");
	const eventToken = await EventToken.deploy();

	await eventTicketsFactory.deployed();
	await eventToken.deployed();

	console.log(
		`Deployed event factory contract address ${eventTicketsFactory.address}`
	);
	console.log(`Deployed event token contract address ${eventToken.address}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
