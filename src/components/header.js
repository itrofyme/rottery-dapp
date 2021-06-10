import React from "react";
import { Flex } from "rimble-ui";
import WalletButton from "./walletButton";
import BuyMLTLink from "./buyMLTLink";
import MyTicketsLink from "./myTicketsLink";

const Header = () => {
  console.log("header");
  return (
    <Flex>
      <BuyMLTLink />
      <MyTicketsLink />
      <WalletButton/>
    </Flex>
  );
};

export default Header;
