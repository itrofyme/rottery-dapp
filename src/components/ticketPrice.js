import { useContext, useEffect, useState } from "react";
import { Card, Box, Heading, Form, Input, Button } from "rimble-ui";
import { getTicketPrice, enterLottery } from "../apis/blockchain";
import BlockchainContext from "../contexts/BlockchainContext";

const TicketPrice = () => {
  const { isMetaMaskConnected, lotteryContract } =
    useContext(BlockchainContext);
  const [numTickets, setNumTickets] = useState(1);
  const [ticketPrice, setTicketPrice] = useState(null);

  useEffect(() => {
    const fetchPrevPrizepool = async () => {
      setTicketPrice(await getTicketPrice(lotteryContract));
    };
    if (isMetaMaskConnected && lotteryContract) {
      fetchPrevPrizepool();
    } else {
      setTicketPrice("...");
    }
  }, [isMetaMaskConnected, lotteryContract]);

  const handleNumTicketsChange = (e) => {
    e.preventDefault();
    setNumTickets(e.target.value);
  };

  const handleBuyTickets = (e) => {
    e.preventDefault();
    enterLottery(lotteryContract, numTickets);
  };

  return (
    <Card p={0} m={2} textAlign="center" borderRadius={12} overflow="hidden">
      <Box bg={isMetaMaskConnected ? "#DBFF33" : "#C1C1C1"} px={4} py={2}>
        <Heading p={0} m={0}>
          Ticket Price
        </Heading>
      </Box>
      <Box pt={4} bg="#FFFFFF">
        {ticketPrice}
      </Box>
      <Form onSubmit={handleBuyTickets}>
        <Input
          type="number"
          required={true}
          onChange={handleNumTicketsChange}
          value={numTickets}
          disabled={!isMetaMaskConnected}
          width={"70px"}
          my={4}
          mx={1}
        />
        <Button type="submit" disabled={!isMetaMaskConnected}>
          Buy Tickets
        </Button>
      </Form>
    </Card>
  );
};

export default TicketPrice;
