import { useContext } from "react";
import BlockchainContext from "../contexts/BlockchainContext";
import { Text } from "rimble-ui";

const AccountText = () => {
  const { account } = useContext(BlockchainContext);

  return (
    <Text m={2} fontFamily="mono" fontSize={15}>
      {account}
    </Text>
  );
};

export default AccountText;
