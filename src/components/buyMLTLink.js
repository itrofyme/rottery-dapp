import { useContext } from "react";
import { Link } from "rimble-ui";
import { getSomeMLT } from "../apis/blockchain";
import BlockchainContext from "../contexts/BlockchainContext";

const BuyMLTLink = () => {
  const { isMetaMaskConnected, tokenContract } = useContext(BlockchainContext);

  const handleBuyMLT = async (e) => {
    e.preventDefault();
    if (isMetaMaskConnected && tokenContract) {
      await getSomeMLT(tokenContract);
    }
  };

  return (
    <Link m={2} p={3} onClick={handleBuyMLT}>
      Get MLT
    </Link>
  );
};

export default BuyMLTLink;
