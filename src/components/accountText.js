import { useContext } from "react";
import { useBlockchainContext } from '../contexts/BlockchainContextTest'
import { Text } from "rimble-ui";

const AccountText = () => {
  const { account } = useBlockchainContext();

  return (
    <Text m={2} fontFamily="mono" fontSize={15}>
      {account}
    </Text>
  );
};

export default AccountText;
