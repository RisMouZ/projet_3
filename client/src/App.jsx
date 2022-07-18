import { EthProvider } from "./contexts/EthContext";
import Workflow from "./workflow";
import "./App.css";

function App() {

  return (
    <EthProvider>
      <div id="App" >
        <div className="container">

          <Workflow />

        </div>
      </div>
    </EthProvider>
  );

}

export default App;
