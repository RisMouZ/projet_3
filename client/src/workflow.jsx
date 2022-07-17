import useEth from "./contexts/EthContext/useEth";
import { useState, useRef } from "react";

function Workflow() {
  const { state: { contract, accounts, owned } } = useEth();
  let options = {
    fromBlock: 0,
    toBlock: 'latest'
  };
  let voterAdd = [];
  let voterProp = [];
  const [status, setStatus] = useState("");
  const [voters, setVoter] = useState([]);
  const [proposals, setProposals] = useState([]);
  const inputVoter = useRef(null);
  const inputProposals = useRef(null);
  const handleVoterButtonClick = async () => {
    await contract.methods.registerVoters(inputVoter.current.value).send({ from: accounts[0] });
    setVoter(voterAdd);
  }
  const handleProposalsButtonClick = async () => {
    await contract.methods.registerProposals(inputProposals.current.value).send({ from: accounts[0] });
    setProposals(voterProp);
  }
  
  if (contract) {
    if (owned) {
      
                   // --------- LISTENERS --------- //
                              // VOTER //
      contract.getPastEvents('VoterRegistered', options)
      .then((result) => {
        result.map((addresse) => {
          voterAdd.push(addresse.returnValues);
          setVoter(voterAdd);
        });
    }).catch((err) => {
      console.log(err);
    });
      
                            // PROPOSALS //
      
    //   contract.getPastEvents('ProposalRegistered', options)
    //   .then((result) => {
    //     result.map((addresse) => {
    //       voterProp.push(addresse.returnValues);
    //       setProposals(voterProp);
    //       // console.log(result);
    //     });
    // }).catch((err) => {
    //   console.log(err);
    // });
      
                  // ------ GET WORKFLOWSTATUS ------ //
      
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
    if (owned && status === "0") {
      return (<div>
        <hr />
        <p>Enregistrement des votants</p>
        <hr />
        <input type="text" placeholder="address" ref={inputVoter} />
        <button onClick={handleVoterButtonClick}>Ajouter un voter</button>
        <br />
        <br />
        <br />
        {/* {voter} */}
        <br />
        <br />
        <br />
        <button onClick={status1}>
              Lancer les propositions
            </button>
      </div>
      );
    }
      
      if (status === "0") {
        return (
          <div>
            <hr />
            <p>
              Enregistrement des votants
            </p>
            <hr />
            {/* {voter} */}

            </div>)

      }
      
      if (owned && status === "1") {
        return (
          <div>
            <hr />
            <p>
              Faites vos propositions !
            </p>
            <hr />

            <input type="text" placeholder="string" ref={inputProposals} />
            <button onClick={handleProposalsButtonClick}>Ajouter un proposition</button>
{/*             
            {proposals} */}
            <hr />
            <button onClick={status2}>
              Fin des propositions
            </button>
            <details>
            <summary>Liste des votants</summary>
              <table>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.voterAddress}</td>
                  </tr>
                ))}
                </tbody>
              </table>      
            </details>
            </div>)

      }

      
      if (status === "1") {
        return (
          <div>
            <hr />
            <p>
              Faites vos propositions !
            </p>
            <hr />
            
            <input type="text" placeholder="string" ref={inputProposals} />
            <button onClick={handleProposalsButtonClick}>Ajouter un proposition</button>
            
            {/* {proposals} */}

            <details>
            <summary>Liste des votants</summary>
            {/* {voter}        */}
            </details>
            </div>)

      }
      
      if (status === "2") {
        return (
          <div>
            <hr />
            {/* {voter} */}
            <hr />
            <p>
              Fin des propositions, le vote commence bientôt !
            </p>
            <button onClick={status3}>
              Début du vote
            </button>
            </div>)

      }
      
      if (status === "3") {
        return (
          <div>
            <hr />
            {/* {voter} */}
            <hr />
            <p>
              Votez !!!
            </p>
            <button onClick={status4}>
              Fin du vote
            </button>
            </div>)

      }
      
      if (status === "4") {
        return (
          <div>
            <hr />
            {/* {voter} */}
            <hr />
            <p>
              Fin des votes ! Merci à tous d'avoir participé ! <br />
              Les résultats seront bientôt en ligne
            </p>
            <button onClick={status5}>
              Annoncer le vainqueur 
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