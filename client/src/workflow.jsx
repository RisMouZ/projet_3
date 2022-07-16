import useEth from "./contexts/EthContext/useEth";
import { useState } from "react";

function Workflow() {
  const { state: { contract, accounts, owned } } = useEth();
  const [status, setStatus] = useState();
  
  if (contract) {
    if (owned) {
      
      const takeWorkFlow = async () => {
        const workflow = await contract.methods.workflowStatus().call({from: accounts[0]});
        setStatus(workflow)
      };
      
      takeWorkFlow();
      
      
      const status1 = async () => {
      await contract.methods.startProposalsRegistration().send({ from: accounts[0] });
      takeWorkFlow();
    }
    
    const status2 = async () => {
      await contract.methods.endProposalsRegistration().send({ from: accounts[0] });
      takeWorkFlow();
    }

    const status3 = async () => {
      await contract.methods.startVotingSession().send({ from: accounts[0] });
      takeWorkFlow();
    }
    
    const status4 = async () => {
      await contract.methods.endVotingSession().send({ from: accounts[0] });
      takeWorkFlow();
    }
    
    const status5 = async () => {
      await contract.methods.votesTallied().send({ from: accounts[0] });
      takeWorkFlow();
    }
      
    // const getWin = async () => {
    //   const winner = await contract.methods.getWinner().call({ from: accounts[0] });
    //   return (
    //     <span>Le gagnant est {winner}</span>
    //   )
    // }
    
      if (status === "0") {
        return (
          <div>
            <p>
              Vous êtes au status
              {status}
            </p>
            <button onClick={status1}>
              Status 1
            </button>
            </div>)

      }
      
      if (status === "1") {
        return (
          <div>
            <p>
              Vous êtes au status
              {status}
            </p>
            <button onClick={status2}>
              Status 2
            </button>
            </div>)

      }
      
      if (status === "2") {
        return (
          <div>
            <p>
              Vous êtes au status
              {status}
            </p>
            <button onClick={status3}>
              Status 3
            </button>
            </div>)

      }
      
      if (status === "3") {
        return (
          <div>
            <p>
              Vous êtes au status
              {status}
            </p>
            <button onClick={status4}>
              Status 4
            </button>
            </div>)

      }
      
      if (status === "4") {
        return (
          <div>
            <p>
              Vous êtes au status
              {status}
            </p>
            <button onClick={status5}>
              Status 5
            </button>
            </div>)

      }
      
      // if (status === "5") {
      //   return (
      //     <div>
      //       <p>
      //         Vous êtes au status
      //         {status}
      //       </p>
      //       <button onClick={getWin}>
      //         Qui c qui a gagné
      //       </button>
      //       <p>
      //         {getWin} 
      //       </p>
      //       </div>)

      // }

      
  }
  
  }
  
}

export default Workflow;