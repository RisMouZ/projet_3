import { EthProvider } from "./contexts/EthContext";
import Workflow from "./workflow";
import Header from "./Header"
import "./App.css";

function App() {

  return (
    
    <EthProvider>
      
      <div id="App" >

        <div className="container">
          
          <Header/>
          <Workflow />

        </div>

      </div>
    </EthProvider>
  );

}

export default App;
