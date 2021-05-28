import { useContext, useEffect, useState } from "react";
import { Card, Box, Heading } from "rimble-ui";
import { getCurrentPrizePool } from "../apis/blockchain";
import BlockchainContext from "../contexts/BlockchainContext";

const CurrentPrizePool = () => {
  const { isMetaMaskConnected, lotteryContract, latestTransactionHash } =
    useContext(BlockchainContext);
  const [currentPrizePool, setCurrentPrizePool] = useState("...");

  useEffect(() => {
    const fetchCurrentPrizepool = async () => {
      const result = await getCurrentPrizePool(lotteryContract);
      setCurrentPrizePool(result);
    };
    if (isMetaMaskConnected && lotteryContract) {
      fetchCurrentPrizepool();
    } else {
      setCurrentPrizePool("...");
    }
  }, [isMetaMaskConnected, lotteryContract, latestTransactionHash]);

  return (
    <Card p={0} m={2} textAlign="center" borderRadius={12} overflow="hidden">
      <Box bg={isMetaMaskConnected ? "#DBFF33" : "#C1C1C1"} px={4} py={2}>
        <Heading p={0} m={0}>
          Current Jackpot
        </Heading>
      </Box>
      <Box py={4} bg="#FFFFFF">
        {currentPrizePool}
      </Box>
    </Card>
  );
};

export default CurrentPrizePool;
