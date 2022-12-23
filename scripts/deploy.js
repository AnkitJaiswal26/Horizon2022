const hre = require("hardhat");

async function main() {
	const EventTicketsFactory = await hre.ethers.getContractFactory(
		"EventTicketsFactory"
	);
	const eventTicketsFactory = await EventTicketsFactory.deploy();

	await eventTicketsFactory.deployed();

	console.log(
		`Deployed event factory contract address ${eventTicketsFactory.address}`
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
