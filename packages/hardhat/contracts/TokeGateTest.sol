// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TokenGate is Ownable {

  //the purpose of this contract is to serve your token gating needs. Will check that the signer is either the owner of the underlying nft
  //or is the address of the NFP assigned owner

    uint256 public gatePrice;

    event EnterGate(string eventName, address user, bytes32 entranceHash, uint256 time, address eventContractAddress, uint256 eventTokenId, bytes32 eventHash);

    constructor() {
      gatePrice = 0;
    }
   
    function setGatePrice(uint256 newPrice) external onlyOwner {
        require(newPrice >= 0, "must include valid price");
        gatePrice=newPrice;
    }

    //this just adds some functionality if you want to enter a passcode
    //entrance Hash is computed by the ticketgate/booth. and used to listen for events with that hash
    //entrancehash should be calculated on the run
    function enterGate(string calldata eventName, bytes32 entranceHash, address eventContractAddress, uint256 eventTokenId) external payable returns(bytes32) {
        require(msg.value >= gatePrice, "You have not paid to enter" );
        require(IERC721(eventContractAddress).ownerOf(eventTokenId) == msg.sender) ;
        bytes32 eventHash = keccak256(abi.encode(eventName, eventContractAddress));
        emit EnterGate(eventName, msg.sender, entranceHash, block.timestamp, eventContractAddress, eventTokenId, eventHash);
        return entranceHash;  
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