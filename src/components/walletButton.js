import { useContext } from "react";
import { MetaMaskButton } from "rimble-ui";
import { requestAccount } from "../apis/blockchain";
import BlockchainContext from "../contexts/BlockchainContext";

const WalletButton = ({ setIsMetaMaskConnected }) => {
  const { isMetaMaskConnected, metaMaskProvider } =
    useContext(BlockchainContext);

  const handleConnectToMetaMask = async (e) => {
    e.preventDefault();
    const accounts = await requestAccount(metaMaskProvider);
    if (accounts.length !== 0) {
      setIsMetaMaskConnected(true);
    }
  };

  return (
    <MetaMaskButton
      m={2}
      onClick={handleConnectToMetaMask}
      disabled={isMetaMaskConnected}
    >
      Connect
    </MetaMaskButton>
  );
};

export default WalletButton;
