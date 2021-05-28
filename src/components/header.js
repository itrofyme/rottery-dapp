import React from "react";
import { Flex } from "rimble-ui";
import WalletButton from "./walletButton";
import BuyMLTLink from "./buyMLTLink";
import MyTicketsLink from "./myTicketsLink";

const Header = ({ setIsMetaMaskConnected }) => {
  return (
    <Flex>
      <BuyMLTLink />
      <MyTicketsLink />
      <WalletButton setIsMetaMaskConnected={setIsMetaMaskConnected} />
    </Flex>
  );
};

export default Header;
