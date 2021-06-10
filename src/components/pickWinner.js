import { useContext, useState } from "react";
import { Card, Box, Heading, Button, Loader } from "rimble-ui";
import { pickWinner } from "../apis/blockchain";
import { useBlockchainContext } from '../contexts/BlockchainContextTest'

const PickWinner = () => {
  const { isMetaMaskConnected, lotteryContract } =
    useBlockchainContext();
  const [loading, setLoading] = useState(false);

  const handlePickWinner = async (e) => {
    e.preventDefault();
    if (isMetaMaskConnected && lotteryContract) {
      setLoading(true)
      const response = await pickWinner(lotteryContract);
      await response.wait()
      setLoading(false)
    }
  };

  if (loading) {
    return (
      <Card p={0} m={2} textAlign="center" borderRadius={12} overflow="hidden">
        <Box bg={isMetaMaskConnected ? "#DBFF33" : "#C1C1C1"} px={4} py={2}>
          <Heading p={0} m={0}>
            Pick Winner
          </Heading>
        </Box>
        <Box alignContent="center">
          <Loader mx={"auto"} my={3}/>
        </Box>
      </Card>
    );
  } else {
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
  }
};

export default PickWinner;
