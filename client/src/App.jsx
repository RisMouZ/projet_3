import { EthProvider } from "./contexts/EthContext";
import Workflow from "./workflow";
import Header from "./Header"
import "./App.css";

function App() {

  return (
    
    <EthProvider>
        <ul class="background">
    <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
</ul>
      <div id="App" >

        <div className="container">
          
          <Header/>
          <hr />
          <Workflow />

        </div>

      </div>
    </EthProvider>
  );

}

export default App;
