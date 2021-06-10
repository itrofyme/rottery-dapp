import { useContext, useState } from "react";
import { Link, Loader } from "rimble-ui";
import { getMLT, approveSpend } from "../apis/blockchain";
import { useBlockchainContext } from '../contexts/BlockchainContextTest'


const BuyMLTLink = () => {
  console.log("BuyMLTLink");
  const { isMetaMaskConnected, tokenContract } = useBlockchainContext();
  const [loading, setLoading] = useState(false);

  const handleBuyMLT = async (e) => {
    e.preventDefault();
    if (isMetaMaskConnected && tokenContract) {
      setLoading(true)
      const response1 = await getMLT(tokenContract)
      await response1.wait()
      const response2 = await approveSpend(tokenContract)
      await response2.wait()
      setLoading(false)
    }
  };

  if (loading) {
    return (
      <Loader mx={"auto"} my={3} size={"30px"}/>
    );
  } else {
    return (
      <Link m={2} p={3} onClick={handleBuyMLT}>
        Get MLT
      </Link>
    );
  }
};

export default BuyMLTLink;
