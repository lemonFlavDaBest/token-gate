// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TokenGate is Ownable {

  //the purpose of this contract is to serve your token gating needs. Will check that the signer is either the owner of the underlying nft
  //or is the address of the NFP assigned owner
    struct Event {
      address eventContractAddress;
      string eventName;
      uint256 eventId;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _eventIdCounter;
    uint256 public gatePrice;
    uint256 public createEventPrice;

    mapping(uint256 => Event) public events;

    event EnterGate(string eventName, address user, bytes32 entranceHash, uint256 time, address eventContractAddress, uint256 eventTokenId, bytes32 eventHash);

    constructor() {
      gatePrice = 1000; //not sure how much this is
      createEventPrice = 1 ether;
    }
   
    function setGatePrice(uint256 newPrice) external onlyOwner {
        require(newPrice >= 0, "must include valid price");
        gatePrice=newPrice;
    }

    function createEvent(string calldata eventName, address eventContractAddress) external payable {
      require(msg.value >= createEventPrice);

    }


    function enterGateV2(string calldata eventName, address eventContractAddress, uint256 eventTokenId) external payable returns(bytes32) {
        require(msg.value >= gatePrice, "You have not paid to enter" );
        require(IERC721(eventContractAddress).ownerOf(eventTokenId) == msg.sender) ;
        bytes32 eventHash = keccak256(abi.encode(eventName, eventContractAddress));
        bytes32 entranceHash = keccak256(abi.encode(msg.sender, eventTokenId));
        emit EnterGate(eventName, msg.sender, entranceHash, block.timestamp, eventContractAddress, eventTokenId, eventHash);
        return entranceHash;  
    }

    function testHash(address testAddress, uint256 eventTokenId) external payable returns(bool) {
        bytes32 entranceHash = keccak256(abi.encode(msg.sender, eventTokenId));
        bytes32 compareHash = keccak256(abi.encode(testAddress, eventTokenId));
        if(entranceHash == compareHash){
          return true;
        } else {
          return false;
        }
    }

    function tokenGateWithdraw() public onlyOwner {
      address owner = msg.sender;
      (bool succ, )= owner.call{value:address(this).balance}("");
      require(succ, "withdraw failed");
    }

  receive() external payable {}
  fallback() external payable {}
}