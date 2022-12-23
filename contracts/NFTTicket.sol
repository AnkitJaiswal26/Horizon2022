pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// import "hardhat/console.sol";

contract EventToken is Context, ERC20 {
    constructor() public ERC20("EventToken", "EVNT") {
        _mint(_msgSender(), 10000 * (10 ** uint256(decimals())));
    }
}

contract EventNFT is Context, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _ticketIds;
    Counters.Counter private _saleTicketId;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct TicketDetails {
        uint256 purchasePrice;
        uint256 sellingPrice;
        bool forSale;
    }

    address private _organiser;
    string private _imageHash;
    address[] private customers;
    uint256[] private ticketsForSale;
    uint256 private _ticketPrice;
    uint256 private _totalSupply;

    mapping(uint256 => TicketDetails) private _ticketDetails;
    mapping(address => uint256[]) private purchasedTickets;

    constructor(
        string memory eventName,
        string memory eventSymbol,
        string memory imageHash,
        uint256 ticketPrice,
        uint256 totalSupply,
        address organiser
    ) ERC721(eventName, eventSymbol) {
        _ticketPrice = ticketPrice;
        _totalSupply = totalSupply;
        _organiser = organiser;
        _imageHash = imageHash;
    }

    modifier isValidTicketCount() {
        require(
            _ticketIds.current() < _totalSupply,
            "Maximum ticket limit exceeded!"
        );
        _;
    }

    modifier isOrganiser() {
        require(_organiser == msg.sender, "User must have minter role to mint");
        _;
    }

    modifier isValidSellAmount(uint256 ticketId) {
        uint256 purchasePrice = _ticketDetails[ticketId].purchasePrice;
        uint256 sellingPrice = _ticketDetails[ticketId].sellingPrice;

        require(
            purchasePrice + ((purchasePrice * 110) / 100) > sellingPrice,
            "Re-selling price is more than 110%"
        );
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
            sellingPrice: 0,
            forSale: false
        });

        return newTicketId;
    }

    function bulkMintTickets(
        uint256 numOfTickets,
        address operator
    ) public virtual isValidTicketCount {
        require(
            (ticketCounts() + numOfTickets) <= 1000,
            "Number of tickets exceeds maximum ticket count"
        );

        for (uint256 i = 0; i < numOfTickets; i++) {
            mint(operator);
        }
    }

    function transferTicket(address buyer, string memory tokenURI) public {
        _saleTicketId.increment();
        uint256 saleTicketId = _saleTicketId.current();

        require(
            msg.sender == ownerOf(saleTicketId),
            "Only initial purchase allowed"
        );

        transferFrom(ownerOf(saleTicketId), buyer, saleTicketId);
        _setTokenURI(saleTicketId, tokenURI);

        if (!isCustomerExist(buyer)) {
            customers.push(buyer);
        }
        purchasedTickets[buyer].push(saleTicketId);
    }

    function secondaryTransferTicket(
        address buyer,
        uint256 saleTicketId,
        string memory tokenURI
    ) public isValidSellAmount(saleTicketId) {
        address seller = ownerOf(saleTicketId);
        uint256 sellingPrice = _ticketDetails[saleTicketId].sellingPrice;

        transferFrom(seller, buyer, saleTicketId);
        _setTokenURI(saleTicketId, tokenURI);

        if (!isCustomerExist(buyer)) {
            customers.push(buyer);
        }

        purchasedTickets[buyer].push(saleTicketId);

        removeTicketFromCustomer(seller, saleTicketId);
        removeTicketFromSale(saleTicketId);

        _ticketDetails[saleTicketId] = TicketDetails({
            purchasePrice: sellingPrice,
            sellingPrice: 0,
            forSale: false
        });
    }

    function setSaleDetails(uint256 ticketId, address operator) public {
        uint256 purchasePrice = _ticketDetails[ticketId].purchasePrice;

        require(
            _organiser != msg.sender,
            "Functionality only allowed for secondary market"
        );

        _ticketDetails[ticketId].sellingPrice = purchasePrice;
        _ticketDetails[ticketId].forSale = true;

        if (!isSaleTicketAvailable(ticketId)) {
            ticketsForSale.push(ticketId);
        }

        approve(operator, ticketId);
    }

    // Get ticket actual price
    function getTicketPrice() public view returns (uint256) {
        return _ticketPrice;
    }

    // Get organiser's address
    function getOrganiser() public view returns (address) {
        return _organiser;
    }

    // Get current ticketId
    function ticketCounts() public view returns (uint256) {
        return _ticketIds.current();
    }

    // Get next sale ticketId
    function getNextSaleTicketId() public view returns (uint256) {
        return _saleTicketId.current();
    }

    // Get selling price for the ticket
    function getSellingPrice(uint256 ticketId) public view returns (uint256) {
        return _ticketDetails[ticketId].sellingPrice;
    }

    // Get all tickets available for sale
    function getTicketsForSale() public view returns (uint256[] memory) {
        return ticketsForSale;
    }

    // Get ticket details
    function getTicketDetails(
        uint256 ticketId
    )
        public
        view
        returns (uint256 purchasePrice, uint256 sellingPrice, bool forSale)
    {
        return (
            _ticketDetails[ticketId].purchasePrice,
            _ticketDetails[ticketId].sellingPrice,
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

    // Utility function to check if customer exists to avoid redundancy
    function isCustomerExist(address buyer) internal view returns (bool) {
        for (uint256 i = 0; i < customers.length; i++) {
            if (customers[i] == buyer) {
                return true;
            }
        }
        return false;
    }

    // Utility function used to check if ticket is already for sale
    function isSaleTicketAvailable(
        uint256 ticketId
    ) internal view returns (bool) {
        for (uint256 i = 0; i < ticketsForSale.length; i++) {
            if (ticketsForSale[i] == ticketId) {
                return true;
            }
        }
        return false;
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
                for (uint256 j = i + 1; j < numOfTickets; j++) {
                    ticketsForSale[j - 1] = ticketsForSale[j];
                }
                ticketsForSale.pop();
            }
        }
    }
}

contract EventMarketplace {
    EventToken private _token;
    EventNFT private _event;

    address private _organiser;

    constructor(EventToken token, EventNFT eventNFT) public {
        _token = token;
        _event = eventNFT;
        _organiser = _event.getOrganiser();
    }

    event Purchase(address indexed buyer, address seller, uint256 ticketId);

    function purchaseTicket(string memory tokenURI) public {
        address buyer = msg.sender;
        _token.transferFrom(buyer, _organiser, _event.getTicketPrice());
        _event.transferTicket(buyer, tokenURI);
    }

    function secondaryPurchase(
        uint256 ticketId,
        string memory tokenURI
    ) public {
        address seller = _event.ownerOf(ticketId);
        address buyer = msg.sender;
        uint256 sellingPrice = _event.getSellingPrice(ticketId);

        _token.transferFrom(buyer, seller, sellingPrice);
        _event.secondaryTransferTicket(buyer, ticketId, tokenURI);

        emit Purchase(buyer, seller, ticketId);
    }
}

contract EventTicketsFactory {
    struct Event {
        string eventName;
        string eventSymbol;
        string imageHash;
        uint256 ticketPrice;
        uint256 totalSupply;
        address marketplace;
    }

    mapping(address => string) users;

    address[] private activeEvents;
    address[] private activeEventsMarketplace;
    mapping(address => Event) private activeEventsMapping;

    event Created(address ntfAddress, address marketplaceAddress);

    // Creates new NFT and a marketplace for its purchase
    function createNewEvent(
        EventToken token,
        string memory eventName,
        string memory eventSymbol,
        string memory imageHash,
        uint256 ticketPrice,
        uint256 totalSupply
    ) public {
        EventNFT newEvent = new EventNFT(
            eventName,
            eventSymbol,
            imageHash,
            ticketPrice,
            totalSupply,
            msg.sender
        );

        EventMarketplace newMarketplace = new EventMarketplace(token, newEvent);

        address newEventAddress = address(newEvent);
        activeEvents.push(newEventAddress);
        activeEventsMapping[newEventAddress] = Event({
            eventName: eventName,
            eventSymbol: eventSymbol,
            imageHash: imageHash,
            ticketPrice: ticketPrice,
            totalSupply: totalSupply,
            marketplace: address(newMarketplace)
        });

        activeEventsMarketplace.push(address(newMarketplace));
        emit Created(newEventAddress, address(newMarketplace));
    }

    function registerUser(string memory ipfsHash) public {
        users[msg.sender] = ipfsHash;
    }

    function getUser() public view returns (string memory) {
        return users[msg.sender];
    }

    function fetchNewEventAddress() public view returns (address) {
        require(activeEvents.length > 0, "No event exists!");
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
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            address
        )
    {
        return (
            activeEventsMapping[eventAddress].eventName,
            activeEventsMapping[eventAddress].eventSymbol,
            activeEventsMapping[eventAddress].imageHash,
            activeEventsMapping[eventAddress].ticketPrice,
            activeEventsMapping[eventAddress].totalSupply,
            activeEventsMapping[eventAddress].marketplace
        );
    }
}
