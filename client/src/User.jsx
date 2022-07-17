import useEth from "./contexts/EthContext/useEth";
import { useState, useRef } from "react";

function User() {
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


      
      if (status === "0") {
        return (
          <div>
            <hr />
            <p>
              Enregistrement des votants
            </p>
            <hr />
            <table>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.voterAddress}</td>
                  </tr>
                ))}
                </tbody>
              </table> 

            </div>)

      }
           
      if ( status === "1") {
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

      }else
      
      if (status === "2") {
        return (
          <div>
            <hr />
            {/* {voter} */}
            <hr />
            <p>
              Fin des propositions, le vote commence bientôt !
            </p>
      

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

      }else
      
      if (status === "3") {
        return (
          <div>
            <hr />
            {/* {voter} */}
            <hr />
            <p>
              Votez !!!
            </p>
       

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

      }else
      
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

export default User;