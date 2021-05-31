//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Lottery is Ownable, AccessControl {
    /* stores player addresses in an array where the index is the ticket number */
    address[] public ticketsArray; 
    /* stores a list of tickets bought by each address */
    mapping(address => uint[]) public playerTickets;
    /* keeps track of the next ticket number to be issued */ 
    uint public ticketCounter;
    /* last winning ticket number */
    uint public prevWinningTicket;
    /* current prize pool */ 
    uint public prizePool;
    /* previous prize pool */ 
    uint public prevPrizePool;
    /* price of one ticket */
    uint public ticketPrice;
    /* portion of the funds set aside for the owner */
    uint public usageFees;
    /* epoch timestamp of when the lottery is becomes open */ 
    uint public lockedUntil;
    /* mod role hash */
    bytes32 public constant MOD_ROLE = keccak256("MOD_ROLE");
    /* an event that signifies a change in lottery state requiring a UI update */
    event LotteryChange(uint timestamp);

    constructor () {
      _setupRole(MOD_ROLE, owner());
      ticketPrice = 20 ether;
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
      uint usageFeesCut = amount / 100 * 5;
      prizePool += (amount - usageFeesCut);
      usageFees += usageFeesCut;
      emit LotteryChange(block.timestamp);
    }

    function createTicket() private {
      ticketsArray.push(msg.sender);
      playerTickets[msg.sender].push(ticketCounter);
      ticketCounter++;
    }

    function pseudoRandom() private view returns (uint) {
      uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
      return (randomHash % ticketCounter);
    } 

    function pickWinner(address tokenAddress) public {
      require(hasRole(MOD_ROLE, msg.sender), "Caller must be a mod");
      require(block.timestamp > lockedUntil);
      lockedUntil = block.timestamp + 5 minutes;
      uint winningTicket = pseudoRandom();
      ERC20(tokenAddress).transfer(ticketsArray[winningTicket], prizePool);
      resetLottery(winningTicket);
      emit LotteryChange(block.timestamp);
    }

    function withdrawFees(address tokenAddress) public onlyOwner {
      ERC20(tokenAddress).transfer(owner(), usageFees);
      usageFees = 0;
    }

    function resetLottery(uint winningTicket) private {
      prevWinningTicket = winningTicket;
      prevPrizePool = prizePool;
      prizePool = 0;
      ticketCounter = 0;
      // TODO: more efficient delete?
      for (uint i = 1; i < ticketsArray.length; i++) {
        delete playerTickets[ticketsArray[i]];
      }
    }

    function getMyTickets() public view returns (uint[] memory) {
      return playerTickets[msg.sender];
    }
}
