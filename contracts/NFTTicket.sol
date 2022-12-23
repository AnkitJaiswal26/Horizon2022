// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTTicket is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether;
    address payable owner;

    mapping(uint256 => Ticket) private idToTicket;

    struct Ticket {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event TicketCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "only owner of the Ticket can change the listing price"
        );
        _;
    }

    constructor() ERC721("Metaverse Tokens", "METT") {
        owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(
        uint256 _listingPrice
    ) public payable onlyOwner {
        require(
            owner == msg.sender,
            "Only ticket owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Mints a token and lists it in the ticket */
    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createTicket(newTokenId, price);
        return newTokenId;
    }

    function createTicket(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        idToTicket[tokenId] = Ticket(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
        emit TicketCreated(tokenId, msg.sender, address(this), price, false);
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(
            idToTicket[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        idToTicket[tokenId].sold = false;
        idToTicket[tokenId].price = price;
        idToTicket[tokenId].seller = payable(msg.sender);
        idToTicket[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createTicketSale(uint256 tokenId) public payable {
        uint256 price = idToTicket[tokenId].price;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        idToTicket[tokenId].owner = payable(msg.sender);
        idToTicket[tokenId].sold = true;
        idToTicket[tokenId].seller = payable(address(0));
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
        payable(owner).transfer(listingPrice);
        payable(idToTicket[tokenId].seller).transfer(msg.value);
    }

    /* Returns all unsold market items */
    function fetchTickets() public view returns (Ticket[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        Ticket[] memory items = new Ticket[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToTicket[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                Ticket storage currentItem = idToTicket[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (Ticket[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToTicket[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        Ticket[] memory items = new Ticket[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToTicket[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                Ticket storage currentItem = idToTicket[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (Ticket[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToTicket[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        Ticket[] memory items = new Ticket[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToTicket[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                Ticket storage currentItem = idToTicket[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
