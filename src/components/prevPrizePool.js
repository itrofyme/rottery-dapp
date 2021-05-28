import { useContext, useEffect, useState } from "react";
import { Card, Box, Heading } from "rimble-ui";
import { getPrevPrizePool } from "../apis/blockchain";
import BlockchainContext from "../contexts/BlockchainContext";

const PrevPrizePool = () => {
  const { isMetaMaskConnected, lotteryContract, latestTransactionHash } =
    useContext(BlockchainContext);
  const [prevPrizePool, setPrevPrizePool] = useState("...");

  useEffect(() => {
    const fetchPrevPrizepool = async () => {
      setPrevPrizePool(await getPrevPrizePool(lotteryContract));
    };
    if (isMetaMaskConnected && lotteryContract) {
      fetchPrevPrizepool();
    } else {
      setPrevPrizePool("...");
    }
  }, [isMetaMaskConnected, lotteryContract, latestTransactionHash]);

  return (
    <Card p={0} m={2} textAlign="center" borderRadius={12} overflow="hidden">
      <Box bg={isMetaMaskConnected ? "#DBFF33" : "#C1C1C1"} px={4} py={2}>
        <Heading p={0} m={0}>
          Previous Jackpot
        </Heading>
      </Box>
      <Box py={4} bg="#FFFFFF">
        {prevPrizePool}
      </Box>
    </Card>
  );
};

export default PrevPrizePool;
