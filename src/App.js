import Lottery from "./components/lottery";
import { BlockchainContextProvider } from "./contexts/BlockchainContextTest";

const App = () => {
  return (
    <BlockchainContextProvider>
      <Lottery />
    </BlockchainContextProvider>
  );
};

export default App;