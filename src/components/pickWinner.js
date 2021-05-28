import { useContext } from "react";
import { Card, Box, Heading, Button } from "rimble-ui";
import { pickWinner } from "../apis/blockchain";
import BlockchainContext from "../contexts/BlockchainContext";

const PickWinner = () => {
  const { isMetaMaskConnected, lotteryContract } =
    useContext(BlockchainContext);

  const handlePickWinner = async (e) => {
    e.preventDefault();
    if (isMetaMaskConnected && lotteryContract) {
      await pickWinner(lotteryContract);
    }
  };

  return (
    <Card p={0} m={2} textAlign="center" borderRadius={12} overflow="hidden">
      <Box bg={isMetaMaskConnected ? "#DBFF33" : "#C1C1C1"} px={4} py={2}>
        <Heading p={0} m={0}>
          Pick Winner
        </Heading>
      </Box>
      <Button
        my={4}
        width={"150px"}
        onClick={handlePickWinner}
        disabled={!isMetaMaskConnected}
      >
        Pick
      </Button>
    </Card>
  );
};

export default PickWinner;
