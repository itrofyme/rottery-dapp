import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import MOKLotteryToken from '../abis/contracts/MOKLotteryToken.sol/MOKLotteryToken.json'
import Lottery from '../abis/contracts/Lottery.sol/Lottery.json'
import addresses from './addresses.json'

const tokenAddress = addresses.MOKLotteryToken;
const lotteryAddress = addresses.Lottery;
const decimalsMultiplier = ethers.BigNumber.from(10).pow(18);

export const addMetamaskListeners = (
  provider,
  chainChangedCallback,
  accountsChangedCallback
) => {
  provider.on('chainChanged', (chainId) => {
    chainChangedCallback(chainId);
  });
  provider.on('accountsChanged', (accounts) => {
    accountsChangedCallback(accounts);
  });
};

export const addContractEventListeners = (provider, lotteryEnterCallback) => {
  const filter = {address: lotteryAddress};
  provider.on(filter, (data) => {
    lotteryEnterCallback(data);
  });
};

export const getMetamaskProvider = async () => {
  const provider = await detectEthereumProvider();
  if (provider) {
    return provider;
  } else {
    return null;
  }
};

export const getTokenContract = (signer) => {
  return new ethers.Contract(tokenAddress, MOKLotteryToken.abi, signer);
};

export const getLotteryContract = (signer) => {
  return new ethers.Contract(lotteryAddress, Lottery.abi, signer)
};

export const getWeb3Provider = (provider) => {
  if (provider) {
    return new ethers.providers.Web3Provider(provider);
  } else {
    return null;
  }
};
 
export const getAccountSigner = async (web3Provider) => {
  return await web3Provider.getSigner();
};
 
export const requestAccount = async (provider) => {
  return await provider.request({ method: 'eth_requestAccounts' });
};

export const getCurrentPrizePool = async (lotteryContract) => {
  let currentPrizePool = 0;
  try {
    currentPrizePool = await lotteryContract.prizePool();
  } catch (err) {
    console.log("error getting prizePool: ", err);
  }  
  
  return ethers.BigNumber.from(currentPrizePool).div(decimalsMultiplier).toString() + " MLT";
}

export const getPrevPrizePool = async (lotteryContract) => {
  let prevPrizePool = 0;
  try {
    prevPrizePool = await lotteryContract.prevPrizePool()
  } catch (err) {
    console.log("error getting prevPrizePool: ", err)
  }  
  prevPrizePool = ethers.BigNumber.from(prevPrizePool).div(decimalsMultiplier).toString()
  return (prevPrizePool.toString() === "0" ? 'none' : prevPrizePool.toString() + " MLT")
}

export const getPrevWinningTicket = async (lotteryContract) => {
  let winningTicket = 0
  try {
    winningTicket = await lotteryContract.prevWinningTicket()
  } catch (err) {
    console.log("error getting prevWinningTicket: ", err)
  }  
  return (winningTicket.toString() === "0" ? 'none' : winningTicket.toString())
}

export const getTicketPrice = async (lotteryContract) => {
  let ticketPrice = 0;
  try {
    ticketPrice = await lotteryContract.ticketPrice()
  } catch (err) {
    console.log("error getting ticketPrice: ", err)
  }  
  return ethers.BigNumber.from(ticketPrice).div(decimalsMultiplier).toString() + " MLT"
}

export const getLockedUntil = async (lotteryContract) => {
  let lockedUntil = 0;
  try {
    lockedUntil = await lotteryContract.lockedUntil()
  } catch (err) {
    console.log("error getting lockedUntil: ", err)
  }  
  return lockedUntil;
}

export const buyTickets = async (lotteryContract, num) => {
  num = parseInt(num)
  if (num <= 0) return
  
  return await lotteryContract.enter(tokenAddress, num)
}

export const getMyTickets = async (lotteryContract) => {
  let myTickets = [];
  try {
    myTickets = await lotteryContract.getMyTickets()
  } catch (err) {
    console.log("error getting getMyTickets: ", err)
  }  
  
  return myTickets;
}

export const getMLT = async (tokenContract) => {
  return await tokenContract.getSome()
}

export const approveSpend = async (tokenContract) => {
  return await tokenContract.approve(lotteryAddress, ethers.BigNumber.from(100).mul(decimalsMultiplier))
}

export const pickWinner = async (lotteryContract) => {
  return await lotteryContract.pickWinner(tokenAddress)
}
