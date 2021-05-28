import React from "react";
import { Container } from "@material-ui/core";
import { Flex } from "rimble-ui";
import CurrentPrizePool from "./currentPrizePool";
import PrevPrizePool from "./prevPrizePool";
import WinningTicket from "./winningTicket";
import TicketPrice from "./ticketPrice";
import LockedUntil from "./lockedUntil";
import PickWinner from "./pickWinner";
import Header from "./header";
import AccountText from "./accountText";

const Lottery = ({ setIsMetaMaskConnected }) => {
  return (
    <Container maxWidth="xs">
      <Flex flexDirection="column" py={2}>
        <Header setIsMetaMaskConnected={setIsMetaMaskConnected} />
        <CurrentPrizePool />
        <PrevPrizePool />
        <WinningTicket />
        <TicketPrice />
        <LockedUntil />
        <PickWinner />
        <AccountText />
      </Flex>
    </Container>
  );
};

export default Lottery;
