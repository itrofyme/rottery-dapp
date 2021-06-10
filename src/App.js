import Lottery from "./components/lottery";
import { BlockchainContextProvider } from "./contexts/BlockchainContextTest";

const App = () => {
  const setIsMetaMaskConnected = () => {};

  console.log("App");
  return (
    <BlockchainContextProvider>
      <Lottery setIsMetaMaskConnected={setIsMetaMaskConnected} />
    </BlockchainContextProvider>
  );
};

export default App;