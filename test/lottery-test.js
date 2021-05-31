const { expect } = require("chai");
const { ethers } = require("hardhat");

const decimalsMultiplier = ethers.BigNumber.from(10).pow(18);
const baseTicketPrice = ethers.BigNumber.from(20).mul(decimalsMultiplier);
const ticketPrice =
  ethers.BigNumber.from(baseTicketPrice).mul(decimalsMultiplier);

const convertToReadableNumber = (num) => {
  return ethers.BigNumber.from(num).div(decimalsMultiplier).toNumber();
};

const convertEpochToTime = (timeEpoch) => {
  var date = new Date(timeEpoch * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  return hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
};

describe("Lottery", function () {
  it("basic test", async function () {
    const [owner, address1, address2, address3, address4, address5, address6] =
      await ethers.getSigners();

    const MOKLotteryToken = await ethers.getContractFactory("MOKLotteryToken");
    const token = await MOKLotteryToken.deploy(1000);

    // deploy lottery
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy();

    // mod address5 and address6 
    await lottery.connect(owner).mod(address5.address, address6.address);

    // get some MLT 
    await token.connect(address1).getSome();
    await token.connect(address2).getSome();
    await token.connect(address3).getSome();
    await token.connect(address4).getSome();

    // approve lottery to transfer MLTs on players behalf
    await token.connect(address1).approve(lottery.address, ticketPrice.mul(1));
    await token.connect(address2).approve(lottery.address, ticketPrice.mul(3));
    await token.connect(address3).approve(lottery.address, ticketPrice.mul(1));
    await token.connect(address4).approve(lottery.address, ticketPrice.mul(2));

    // enter the lottery
    await lottery.connect(address1).enter(token.address, 1);
    await lottery.connect(address2).enter(token.address, 3);
    await lottery.connect(address3).enter(token.address, 1);
    await lottery.connect(address4).enter(token.address, 2);

    // check that players are entered
    const playerAddr1 = await lottery.ticketsArray(0);
    const playerAddr2 = await lottery.ticketsArray(3);
    const playerAddr3 = await lottery.ticketsArray(4);
    const playerAddr4 = await lottery.ticketsArray(5);

    expect(playerAddr1).to.equal(address1.address);
    expect(playerAddr2).to.equal(address2.address);
    expect(playerAddr3).to.equal(address3.address);
    expect(playerAddr4).to.equal(address4.address);

    // get lockedUntil before the lottery is drawn
    const lockedUntilBef = await lottery.connect(owner).lockedUntil();

    // get player MLT balances before the lottery is drawn
    const b1Bef = convertToReadableNumber(await token.balanceOf(address1.address));
    const b2Bef = convertToReadableNumber(await token.balanceOf(address2.address));
    const b3Bef = convertToReadableNumber(await token.balanceOf(address3.address));
    const b4Bef = convertToReadableNumber(await token.balanceOf(address4.address));

    // get prize pool and previous prize pool variables before the lottery is drawn
    const prizePoolBef = convertToReadableNumber(await lottery.connect(owner).prizePool());
    const prevPrizePoolBef = convertToReadableNumber(await lottery.connect(owner).prevPrizePool());

    // check that balances reflect how many tickets were purchased
    expect(b1Bef).to.equal(80);
    expect(b2Bef).to.equal(40);
    expect(b3Bef).to.equal(80);
    expect(b4Bef).to.equal(60);

    // check that the prize pool is the sum of purchased tickets
    expect(prizePoolBef).to.equal(140 * 0.95);
    expect(prevPrizePoolBef).to.equal(0);

    // check that everyone can get the tickets they bought
    const myTickets1 = await lottery.connect(address1).getMyTickets();
    const myTickets2 = await lottery.connect(address2).getMyTickets();
    const myTickets3 = await lottery.connect(address3).getMyTickets();
    const myTickets4 = await lottery.connect(address4).getMyTickets();

    expect(myTickets1.length).to.equal(1);
    expect(myTickets2.length).to.equal(3);
    expect(myTickets3.length).to.equal(1);
    expect(myTickets4.length).to.equal(2);

    // draw the lottery
    await lottery.connect(owner).pickWinner(token.address);

    // check that the winning ticket .. is okay
    const prevWinningTicket = await lottery.connect(owner).prevWinningTicket();
    expect(prevWinningTicket).to.be.ok;

    // check that lottery is locked after being drawn
    const lockedUntilAft = await lottery.connect(owner).lockedUntil();
    expect(lockedUntilAft.toNumber()).to.be.greaterThan(lockedUntilBef.toNumber());

    // check balances add up after someone won the lottery
    const b1Aft = convertToReadableNumber(await token.balanceOf(address1.address));
    const b2Aft = convertToReadableNumber(await token.balanceOf(address2.address));
    const b3Aft = convertToReadableNumber(await token.balanceOf(address3.address));
    const b4Aft = convertToReadableNumber(await token.balanceOf(address4.address));

    const totalBalanceBefore = b1Bef + b2Bef + b3Bef + b4Bef;
    const totalBalanceAfter = b1Aft + b2Aft + b3Aft + b4Aft;
    const totalDifference = totalBalanceAfter - totalBalanceBefore;

    // check that prize pools are updated after the lottery was drawn
    const prizePoolAft = convertToReadableNumber(await lottery.connect(owner).prizePool());
    const prevPrizePoolAft = convertToReadableNumber(await lottery.connect(owner).prevPrizePool());

    expect(prizePoolAft).to.equal(0);
    expect(prevPrizePoolAft).to.equal(140 * 0.95);
    expect(totalDifference).to.equal(prevPrizePoolAft)

    // the owners ability to withdraw fees
    const b0Bef = convertToReadableNumber(await token.balanceOf(owner.address));
    await lottery.connect(owner).withdrawFees(token.address);
    const b0Aft = convertToReadableNumber(await token.balanceOf(owner.address));
    expect(b0Aft).to.equal(b0Bef + 140 * 0.05);
  });
});
