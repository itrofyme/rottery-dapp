import { useContext, useEffect, useState } from "react";
import { Card, Box, Heading } from "rimble-ui";
import { getPrevWinningTicket } from "../apis/blockchain";
import { useBlockchainContext } from '../contexts/BlockchainContextTest'

const WinningTicket = () => {
  const { isMetaMaskConnected, lotteryContract, latestTransactionHash } =
    useBlockchainContext();
  const [prevWinningTicket, setPrevWinningTicket] = useState("...");

  useEffect(() => {
    const fetchPrevWinningTicket = async () => {
      setPrevWinningTicket(await getPrevWinningTicket(lotteryContract));
    };
    if (isMetaMaskConnected && lotteryContract) {
      fetchPrevWinningTicket();
    } else {
      setPrevWinningTicket("...");
    }
  }, [isMetaMaskConnected, lotteryContract, latestTransactionHash]);

  return (
    <Card p={0} m={2} textAlign="center" borderRadius={12} overflow="hidden">
      <Box bg={isMetaMaskConnected ? "#DBFF33" : "#C1C1C1"} px={4} py={2}>
        <Heading p={0} m={0}>
          Winning Ticket
        </Heading>
      </Box>
      <Box py={4} bg="#FFFFFF">
        {prevWinningTicket}
      </Box>
    </Card>
  );
};

export default WinningTicket;
