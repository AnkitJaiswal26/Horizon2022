// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract EventNFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _ticketIds;
    Counters.Counter private _saleTicketId;

    struct TicketDetails {
        uint256 purchasePrice;
        bool forSale;
    }

    address private _organiser;
    address[] private customers;
    uint256[] private ticketsForSale;
    uint256 private _ticketPrice;
    uint256 private _totalSupply;

    mapping(uint256 => TicketDetails) private _ticketDetails;
    mapping(address => uint256[]) private purchasedTickets;

    constructor(
        string memory eventName,
        string memory eventSymbol,
        uint256 ticketPrice,
        uint256 totalSupply,
        address organiser
    ) ERC721(eventName, eventSymbol) {
        _ticketPrice = ticketPrice;
        _totalSupply = totalSupply;
        _organiser = organiser;
    }

    modifier isOrganiser() {
        require(_organiser == msg.sender);
        _;
    }

    function mint(
        address operator
    ) internal virtual isOrganiser returns (uint256) {
        _ticketIds.increment();
        uint256 newTicketId = _ticketIds.current();
        _mint(operator, newTicketId);

        _ticketDetails[newTicketId] = TicketDetails({
            purchasePrice: _ticketPrice,
            forSale: false
        });

        return newTicketId;
    }

    function bulkMintTickets(
        uint256 numOfTickets,
        address operator
    ) public virtual {
        require(_ticketIds.current() < _totalSupply);
        require((_ticketIds.current() + numOfTickets) <= 1000);

        for (uint256 i = 0; i < numOfTickets; i++) {
            mint(operator);
        }
    }

    function transferTicket(address buyer, string memory tokenURI) public {
        _saleTicketId.increment();
        uint256 saleTicketId = _saleTicketId.current();

        transferFrom(ownerOf(saleTicketId), buyer, saleTicketId);
        _setTokenURI(saleTicketId, tokenURI);

        customers.push(buyer);
        purchasedTickets[buyer].push(saleTicketId);
    }

    function secondaryTransferTicket(
        address buyer,
        uint256 saleTicketId,
        string memory tokenURI
    ) public {
        address seller = ownerOf(saleTicketId);
        uint256 sellingPrice = _ticketDetails[saleTicketId].purchasePrice;

        transferFrom(seller, buyer, saleTicketId);
        _setTokenURI(saleTicketId, tokenURI);

        purchasedTickets[buyer].push(saleTicketId);

        removeTicketFromCustomer(seller, saleTicketId);
        removeTicketFromSale(saleTicketId);

        _ticketDetails[saleTicketId] = TicketDetails({
            purchasePrice: sellingPrice,
            forSale: false
        });
    }

    function setSaleDetails(uint256 ticketId, address operator) public {
        _ticketDetails[ticketId].forSale = true;
        ticketsForSale.push(ticketId);
        approve(operator, ticketId);
    }

    // Get organiser's address
    function getOrganiser() public view returns (address) {
        return _organiser;
    }

    // Get all tickets available for sale
    function getTicketsForSale() public view returns (uint256[] memory) {
        return ticketsForSale;
    }

    // Get ticket actual price
    function getTicketPrice() public view returns (uint256) {
        return _ticketPrice;
    }

    // Get ticket details
    function getTicketDetails(
        uint256 ticketId
    ) public view returns (uint256 purchasePrice, bool forSale) {
        return (
            _ticketDetails[ticketId].purchasePrice,
            _ticketDetails[ticketId].forSale
        );
    }

    // Get all tickets owned by a customer
    function getTicketsOfCustomer(
        address customer
    ) public view returns (uint256[] memory) {
        return purchasedTickets[customer];
    }

    function getAllCustomers() public view returns (address[] memory) {
        return customers;
    }

    // Utility function to remove ticket owned by customer from customer to ticket mapping
    function removeTicketFromCustomer(
        address customer,
        uint256 ticketId
    ) internal {
        uint256 numOfTickets = purchasedTickets[customer].length;

        for (uint256 i = 0; i < numOfTickets; i++) {
            if (purchasedTickets[customer][i] == ticketId) {
                for (uint256 j = i + 1; j < numOfTickets; j++) {
                    purchasedTickets[customer][j - 1] = purchasedTickets[
                        customer
                    ][j];
                }
                purchasedTickets[customer].pop();
            }
        }
    }

    // Utility function to remove ticket from sale list
    function removeTicketFromSale(uint256 ticketId) internal {
        uint256 numOfTickets = ticketsForSale.length;

        for (uint256 i = 0; i < numOfTickets; i++) {
            if (ticketsForSale[i] == ticketId) {
                ticketsForSale[i] = ticketsForSale[ticketsForSale.length - 1];
                ticketsForSale.pop();
                break;
            }
        }
    }
}
