// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./EventMarketplace.sol";
import "./EventNFT.sol";

contract EventTicketsFactory {
    struct Event {
        string eventName;
        string eventSymbol;
        string imageHash;
        string imageName;
        string description;
        uint256 ticketPrice;
        uint256 totalSupply;
        address marketplace;
    }

    address[] private activeEvents;
    address[] private activeEventsMarketplace;
    mapping(address => Event) private activeEventsMapping;

    event Created(address ntfAddress, address marketplaceAddress);

    // Creates new NFT and a marketplace for its purchase
    function createNewEvent(
        string memory eventName,
        string memory eventSymbol,
        string memory imageHash,
        string memory imageName,
        string memory description,
        uint256 ticketPrice,
        uint256 totalSupply
    ) public {
        EventNFT newEvent = new EventNFT(
            eventName,
            eventSymbol,
            ticketPrice,
            totalSupply,
            msg.sender
        );

        EventMarketplace newMarketplace = new EventMarketplace(newEvent);

        address newEventAddress = address(newEvent);
        activeEvents.push(newEventAddress);
        activeEventsMapping[newEventAddress] = Event({
            eventName: eventName,
            eventSymbol: eventSymbol,
            imageHash: imageHash,
            imageName: imageName,
            description: description,
            ticketPrice: ticketPrice,
            totalSupply: totalSupply,
            marketplace: address(newMarketplace)
        });

        activeEventsMarketplace.push(address(newMarketplace));
        emit Created(newEventAddress, address(newMarketplace));
    }

    function fetchNewEventAddress() public view returns (address) {
        return activeEvents[activeEvents.length - 1];
    }

    function fetchNewEventMarketPlaceAddress() public view returns (address) {
        return activeEventsMarketplace[activeEvents.length - 1];
    }

    // Get all active fests
    function getActiveEvents() public view returns (address[] memory) {
        return activeEvents;
    }

    // Get fest's details
    function getEventDetails(
        address eventAddress
    ) public view returns (Event memory) {
        return activeEventsMapping[eventAddress];
    }
}
