import { useState, useEffect } from "react";
import Lottery from "./components/lottery";
import {
  addContractEventListeners,
  addMetamaskListeners,
  getMetamaskProvider,
  getWeb3Provider,
  getAccountSigner,
  getTokenContract,
  getLotteryContract,
} from "./apis/blockchain";
import BlockchainContext from "./contexts/BlockchainContext";

const App = () => {
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [metaMaskProvider, setMetaMaskProvider] = useState(null);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [lotteryContract, setLotteryContract] = useState(null);
  const [latestTransactionHash, setLatestTransactionHash] = useState(null);

  useEffect(() => {
    const getProvider = async () => {
      const metamask = await getMetamaskProvider();
      setMetaMaskProvider(metamask);
    };
    getProvider();
  }, []);

  useEffect(() => {
    const chainChangedCallback = () => {
      window.location.reload();
    };

    const accountsChangedCallback = async (accounts) => {
      if (accounts.length === 0) {
        setIsMetaMaskConnected(false);
      } else {
        setIsMetaMaskConnected(true);
        setAccount(accounts[0]);
      }
    };

    if (metaMaskProvider) {
      setWeb3Provider(getWeb3Provider(metaMaskProvider));
      addMetamaskListeners(
        metaMaskProvider,
        chainChangedCallback,
        accountsChangedCallback
      );
    }
  }, [metaMaskProvider]);

  useEffect(() => {
    if (web3Provider) {
      const getSigner = async () => {
        setSigner(await getAccountSigner(web3Provider));
      };
      getSigner();
      addContractEventListeners(web3Provider, (data) => {setLatestTransactionHash(data.transactionHash)})
    }
  }, [web3Provider]);

  useEffect(() => {
    if (signer) {
      setTokenContract(getTokenContract(signer));
      setLotteryContract(getLotteryContract(signer));
    }
  }, [signer]);

  return (
    <BlockchainContext.Provider
      value={{
        isMetaMaskConnected,
        metaMaskProvider,
        web3Provider,
        account,
        signer,
        tokenContract,
        lotteryContract,
        latestTransactionHash
      }}
    >
      <Lottery setIsMetaMaskConnected={setIsMetaMaskConnected} />
    </BlockchainContext.Provider>
  );
};

export default App;
