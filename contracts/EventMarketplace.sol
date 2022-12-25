// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./EventNFT.sol";

contract EventMarketplace {
    EventNFT private _event;

    constructor(EventNFT eventNFT) public {
        _event = eventNFT;
    }

    event Purchase(address indexed buyer, address seller, uint256 ticketId);

    function purchaseTicket(string memory tokenURI) public payable {
        require(_event.getTicketPrice() == msg.value);
        address buyer = msg.sender;
        payable(_event.getOrganiser()).transfer(msg.value);
        _event.transferTicket(buyer, tokenURI);
    }

    function secondaryPurchase(
        uint256 ticketId,
        string memory tokenURI
    ) public payable {
        address seller = _event.ownerOf(ticketId);
        address buyer = msg.sender;
        uint256 sellingPrice = _event.getTicketPrice();

        require(sellingPrice == msg.value);

        payable(seller).transfer(sellingPrice);
        _event.secondaryTransferTicket(buyer, ticketId, tokenURI);

        emit Purchase(buyer, seller, ticketId);
    }
}
