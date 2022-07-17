import { EthProvider } from "./contexts/EthContext";
import Workflow from "./workflow";
import Index from "./components/Main/index"
import "./App.css";

function App() {

  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          
          <Index/>      
          <hr />
          <Workflow/>

        </div>
      </div>
    </EthProvider>
  );

}

export default App;
