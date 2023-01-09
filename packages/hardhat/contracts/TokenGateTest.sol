// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TokenGate is Ownable {

  //the purpose of this contract is to serve your token gating needs. Will check that the signer is either the owner of the underlying nft
  //or is the address of the NFP assigned owner
    struct EventInfo {
      address eventAddress;
      string eventName;
      uint256 eventId;
      address eventCreator;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _eventIdCounter;
    uint256 public gatePrice;
    uint256 public createEventPrice;

    mapping(uint256 => EventInfo) public events;

    event CreateEvent(string eventName, address eventContractAddress, uint256 time, address eventCreator, uint256 eventId);
    event EnterGate(string eventName, address user, bytes32 entranceHash, uint256 time, address eventContractAddress, uint256 eventTokenId, bytes32 eventHash, uint256 eventId);

    constructor() {
      gatePrice = 1000; //not sure how much this is
      createEventPrice = 1 ether;
    }
   
    function setGatePrice(uint256 newPrice) external onlyOwner {
        require(newPrice >= 0, "must include valid price");
        gatePrice=newPrice;
    }

    function createEvent(string calldata _eventName, address eventContractAddress) external payable returns(uint256){
      require(msg.value >= createEventPrice);
      _eventIdCounter.increment();
      uint256 _eventId = _eventIdCounter.current();
      EventInfo storage info = events[_eventId];
      info.eventAddress = eventContractAddress;
      info.eventName = _eventName;
      info.eventId = _eventId;
      info.eventCreator = msg.sender;
      emit CreateEvent(_eventName, eventContractAddress, block.timestamp, msg.sender, _eventId);
      return _eventId;
    }


    function enterGate(string memory _eventName, address eventContractAddress, uint256 eventTokenId, uint256 _eventId) external payable returns(bytes32) {
        require(msg.value >= gatePrice, "You have not paid to enter" );
        require(events[_eventId].eventAddress == eventContractAddress, "the eventId does not match the event contract address");
        require(IERC721(eventContractAddress).ownerOf(eventTokenId) == msg.sender) ;
        bytes32 eventHash = keccak256(abi.encode(_eventName, eventContractAddress));
        bytes32 entranceHash = keccak256(abi.encode(msg.sender, eventTokenId));
        emit EnterGate(_eventName, msg.sender, entranceHash, block.timestamp, eventContractAddress, eventTokenId, eventHash, _eventId);
        return entranceHash;  
    }

    function tokenGateWithdraw() public onlyOwner {
      address owner = msg.sender;
      (bool succ, )= owner.call{value:address(this).balance}("");
      require(succ, "withdraw failed");
    }

  receive() external payable {}
  fallback() external payable {}
}