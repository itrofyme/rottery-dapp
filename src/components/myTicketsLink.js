import React, { useState, useContext, useEffect } from "react";
import { Link, Modal, Card, Button, Box, Heading, Text } from "rimble-ui";
import { getMyTickets } from "../apis/blockchain";
import { useBlockchainContext } from '../contexts/BlockchainContextTest'

const MyTicketsLink = () => {
  const [isMyTicketsOpen, setIsMyTicketsOpen] = useState(false);
  const [myTicketsFormatted, setMyTicketsFormatted] = useState([
    <Text as="li" key={0}>
      {"none"}
    </Text>,
  ]);
  const { isMetaMaskConnected, lotteryContract, latestTransactionHash } =
    useBlockchainContext();

  const closeMyTicketsModal = (e) => {
    e.preventDefault();
    setIsMyTicketsOpen(false);
  };

  const openMyTicketsModal = (e) => {
    e.preventDefault();
    if (isMetaMaskConnected) {
      setIsMyTicketsOpen(true);
    }
  };

  useEffect(() => {
    const fetchMyTickets = async () => {
      setMyTickets(await getMyTickets(lotteryContract));
    };
    if (isMetaMaskConnected && lotteryContract) {
      fetchMyTickets();
    } else {
      setMyTicketsFormatted([
        <Text as="li" key={0}>
          {"none"}
        </Text>,
      ]);
    }
  }, [isMetaMaskConnected, lotteryContract, latestTransactionHash]);

  const setMyTickets = (myTickets) => {
    let ticketItems = [];
    if (myTickets.length === 0) {
      ticketItems.push(
        <Text as="li" key={0}>
          {"none"}
        </Text>
      );
    } else {
      for (const [index, value] of myTickets.entries()) {
        ticketItems.push(
          <Text as="li" key={index}>
            {value.toString()}
          </Text>
        );
      }
    }

    setMyTicketsFormatted(ticketItems);
  };

  return (
    <React.Fragment>
      <Link m={2} p={3} onClick={openMyTicketsModal}>
        My Tickets
      </Link>
      <Modal isOpen={isMyTicketsOpen}>
        <Card width={"350px"} p={0}>
          <Button.Text
            icononly
            icon={"Close"}
            color={"moon-gray"}
            position={"absolute"}
            top={0}
            right={0}
            mt={3}
            mr={3}
            onClick={closeMyTicketsModal}
          />
          <Box p={4} mb={3}>
            <Heading>Your Tickets</Heading>
            <Text as="ul">{myTicketsFormatted}</Text>
          </Box>
        </Card>
      </Modal>
    </React.Fragment>
  );
};

export default MyTicketsLink;
