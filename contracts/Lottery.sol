//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Lottery is Ownable, AccessControl {
    address[] public playersArray;
    mapping(address => uint[]) public playerTickets;
    uint public ticketCounter;
    uint public prevWinningTicket;
    uint public prizePool;
    uint public prevPrizePool;
    uint public ticketPrice;
    uint public usageFees;
    uint public lockedUntil;
    bytes32 public constant MOD_ROLE = keccak256("MOD_ROLE");
    event LotteryChange(uint timestamp);

    constructor () {
      _setupRole(MOD_ROLE, owner());
      playersArray.push();
      ticketPrice = 20 * 10**18;
      lockedUntil = block.timestamp;
    }

    function mod(address mod1, address mod2) public onlyOwner {
      _setupRole(MOD_ROLE, mod1);
      _setupRole(MOD_ROLE, mod2);    
    }

    function enter(address tokenAddress, uint num) public {
      require(block.timestamp > lockedUntil);
      uint amount = num * ticketPrice;
      ERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
      for (uint t = 0; t < num; t++) {
        createTicket();
      }
      prizePool += amount;
      emit LotteryChange(block.timestamp);
    }

    function createTicket() private {
      ticketCounter++;
      playersArray.push(msg.sender);
      playerTickets[msg.sender].push(ticketCounter);
    }

    function pseudoRandom() private view returns (uint) {
      uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
      return (randomHash % ticketCounter) + 1;
    } 

    function pickWinner(address tokenAddress) public {
      require(hasRole(MOD_ROLE, msg.sender), "Caller must be a mod");
      require(block.timestamp > lockedUntil);
      lockedUntil = block.timestamp + 5 minutes;
      uint winningTicket = pseudoRandom();
      ERC20(tokenAddress).transfer(playersArray[winningTicket], prizePool / 100 * 95);
      usageFees += prizePool / 100 * 5;
      prevWinningTicket = winningTicket;
      resetLottery();
      emit LotteryChange(block.timestamp);
    }

    function withdrawFees(address tokenAddress) public onlyOwner {
      ERC20(tokenAddress).transfer(owner(), usageFees);
      usageFees = 0;
    }

    function resetLottery() private {
      prevPrizePool = prizePool;
      prizePool = 0;
      ticketCounter = 0;
      for (uint i = 1; i < playersArray.length; i++) {
        delete playerTickets[playersArray[i]];
      }
      delete playersArray;
      playersArray.push();
    }

    function getMyTickets() public view returns (uint[] memory) {
      return playerTickets[msg.sender];
    }
}
