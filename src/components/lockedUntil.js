import { useContext, useEffect, useState } from "react";
import { Card, Box, Heading } from "rimble-ui";
import { getLockedUntil } from "../apis/blockchain";
import BlockchainContext from "../contexts/BlockchainContext";

const LockedUntil = () => {
  const { isMetaMaskConnected, lotteryContract, latestTransactionHash } =
    useContext(BlockchainContext);
  const [lockedUntil, setLockedUntil] = useState("...");

  const convertLockedUntilToReadable = (timeEpoch) => {
    let date = new Date(timeEpoch * 1000);
    if (date < new Date()) {
      return "unlocked";
    } else {
      let hours = date.getHours();
      let minutes = "0" + date.getMinutes();
      let seconds = "0" + date.getSeconds();
      return hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    }
  };

  useEffect(() => {
    const fetchLockedUntil = async () => {
      const result = await getLockedUntil(lotteryContract);
      const formattedLockedUntil = convertLockedUntilToReadable(result);
      setLockedUntil(formattedLockedUntil);
    };
    if (isMetaMaskConnected && lotteryContract) {
      fetchLockedUntil();
    } else {
      setLockedUntil("...");
    }
  }, [isMetaMaskConnected, lotteryContract, latestTransactionHash]);

  return (
    <Card p={0} m={2} textAlign="center" borderRadius={12} overflow="hidden">
      <Box bg={isMetaMaskConnected ? "#DBFF33" : "#C1C1C1"} px={4} py={2}>
        <Heading p={0} m={0}>
          Locked Until
        </Heading>
      </Box>
      <Box py={4} bg="#FFFFFF">
        {lockedUntil}
      </Box>
    </Card>
  );
};

export default LockedUntil;
