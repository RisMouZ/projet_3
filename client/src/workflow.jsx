import useEth from "./contexts/EthContext/useEth";
import { useState, useRef } from "react";

function Workflow() {
  const { state: { contract, accounts, owned } } = useEth();

  let options = {
    fromBlock: 0,
    toBlock: 'latest'
  };

  let options1 = {
    fromBlock: 0
  };

  let voterAdd = [];
  let voterProp = [];
  let resultProp = [];
  let voterVotedId = [];
  const [status, setStatus] = useState("0");
  const [voters, setVoter] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [hasVoted, setVoted] = useState(false)
  const [winner, setWinner] = useState();
  const [proposalsFinal, setPropFinal] = useState([])
  const [votersFinal, setVoterFinal] = useState([])
  const inputVoter = useRef(null);
  const inputProposals = useRef(null);
  const inputVoteId = useRef(null);

  const handleVoterButtonClick = async () => {
    await contract.methods.registerVoters(inputVoter.current.value).send({ from: accounts[0] });
    setVoter(voterAdd);
  }

  const handleProposalsButtonClick = async () => {
    await contract.methods.registerProposals(inputProposals.current.value).send({ from: accounts[0] });
    setProposals(voterProp);
  }
  
  const handleVoteButtonClick = async () => {
    await contract.methods.vote(inputVoteId.current.value).send({ from: accounts[0] });
    setVoted(true);
  }

  const propRecap = async (e) => {
    const recap = await contract.methods.getOneProposal(e).call({ from: accounts[0] });
    resultProp.push(recap);
  }
  
  // voterProp[event.returnValues.proposalId].voteCount + 1

  if (contract) {
    


    // --------- LISTENERS --------- //

    // WORKFLOW STATUS //
    
    contract.events.WorkflowStatusChange(options1)
      .on('data', event => setStatus( event.returnValues.newStatus))
  

    // VOTER //

    contract.getPastEvents('VoterRegistered', options)
    .then((result) => {
      result.map((addresse) => {
        voterAdd.push({ addr: addresse.returnValues.voterAddress });
        setVoter(voterAdd);
      });
    }).catch((err) => {
      console.log(err);
    });
    
    // PROPOSALS //
    
    contract.getPastEvents('ProposalRegistered', options)
    .then((result) => {
      result.map((addresse) => {
        voterProp.push(addresse.returnValues);
        setProposals(voterProp);
      });
    }).catch((err) => {
      console.log(err);
    });
    
    // VOTE ID //
    
    contract.events.Voted(options1)
      .on('data', event => {
        let addressVoter = event.returnValues.voter;
        let voteId = event.returnValues.proposalId;
        voterVotedId.push({ addr: addressVoter, id: voteId })
        setVoterFinal(voterVotedId)
      }
        )  

    // console.log(voterProp[parseInt(event.returnValues.proposalId)])
                  // ------ SET WORKFLOWSTATUS ------ //
      
      // const takeWorkFlow = async () => {
      //   const workflow = await contract.methods.workflowStatus().call({from: accounts[0]});
      //   // setStatus(workflow)
      // };
      
      // takeWorkFlow();
  
    
      const status1 = async () => {
      await contract.methods.startProposalsRegistration().send({ from: accounts[0] });
      // takeWorkFlow();
    }
    
    const status2 = async () => {
      await contract.methods.endProposalsRegistration().send({ from: accounts[0] });
      // takeWorkFlow();
    }

    const status3 = async () => {
      await contract.methods.startVotingSession().send({ from: accounts[0] });
      // takeWorkFlow();
    }
    
    const status4 = async () => {
      await contract.methods.endVotingSession().send({ from: accounts[0] });
      // takeWorkFlow();
    }
    
    const status5 = async () => {
      await contract.methods.votesTallied().send({ from: accounts[0] });
      // takeWorkFlow();
    }
      
    const getWin = async () => {
      const whoWin = await contract.methods.getWinner().call({ from: accounts[0] });
      setWinner(whoWin.description);
      for (let i = 0; i < proposals.length; i++) {
        propRecap(i);  
      };
      resultProp.reverse();
      setPropFinal(resultProp)
    }


    if (owned && status === "0") {
      return (
        <div className="owner">

        <div className="vote">
            <h1>
        Enregistrement des votants
        </h1>
        <input type="text" placeholder="address" ref={inputVoter} />
        <button onClick={handleVoterButtonClick}>Ajouter un voter</button>
        <br />
        <br />
        <br />
        <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>

        <br />
        <br />
        <br />
        <button onClick={status1}>
              Lancer les propositions
            </button>
      </div>
    </div>
      );
    }
      
      if (status === "0") {
        return (
          <div className="user">
            <div className="vote">

          <h1>
        Enregistrement des votants
        </h1>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>
          </div>
                </div>
            )

      }
      
      if (owned && status === "1") {
        return (
          <div className="owner">
          <div className="vote">
              <h1>
              Faites vos propositions !
            </h1>
         
            <input type="text" placeholder="string" ref={inputProposals} />
            <button onClick={handleProposalsButtonClick}>Ajouter une proposition</button>
            <br />
            <br />
            <br />
            <table>
                <thead>
                  <th>ID</th>
                  <th>Description</th>
                </thead>
              <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.proposalId}</td>
                <td>{proposal.desc}</td>
                <td>{proposal.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table> 
            
            <button onClick={status2}>
              Fin des propositions
            </button>
            <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>      
            </details>
            </div>
            </div>
            )

      }

      
      if (status === "1") {
        return (
          <div className="user">

          <div className="vote">
          <h1>
              Faites vos propositions !
            </h1>
            
            <input type="text" placeholder="string" ref={inputProposals} />
            <button onClick={handleProposalsButtonClick}>Ajouter une proposition</button>
            
            <table>
                <thead>
                  <th>ID</th>
                  <th>Description</th>
                </thead>
              <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.proposalId}</td>
                <td>{proposal.desc}</td>
                <td>{proposal.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>

            <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>    
            </details>
          </div>
          </div>
        )

      }
      
      if (owned && status === "2") {
        return (
          <div className="owner">

          <div className="vote">
              <h1>
              Fin des propositions, le vote commence bientôt !
            </h1>
            <button onClick={status3}>
              Début du vote
            </button>

            <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>    
            </details>
            <details>
              <summary>Tableau des propositions</summary>
              <table>
                <thead>
                  <th>ID</th>
                  <th>Description</th>
                </thead>
              <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.proposalId}</td>
                <td>{proposal.desc}</td>
                <td>{proposal.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </details>
            </div>
          </div>
        )

      }
    
      if (status === "2") {
        return (
          <div className="user">

          <div className="vote">
          <h1>
              Fin des propositions, le vote commence bientôt !
            </h1>

            <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>     
            </details>
            <details>
              <summary>Tableau des propositions</summary>
              <table>
                <thead>
                  <th>ID</th>
                  <th>Description</th>
                </thead>
              <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.proposalId}</td>
                <td>{proposal.desc}</td>
                <td>{proposal.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </details>
            </div>
          </div>
        )

      }
      
      if (owned && status === "3") {
        return (
          <div className="owner">
            
          <div className="vote">
            
            <h1>
              Votez !!!
            </h1>

            <label htmlFor="Vote">Choisissez votre proposition favorite</label>
            <br />
            <input type="number" placeholder="Id de la proposition" ref={inputVoteId} />
            <button onClick={handleVoteButtonClick}>Voter</button>


            <button onClick={status4}>
              Fin du vote
            </button>

            <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>     
            </details>
            <details>
              <summary>Tableau des propositions</summary>
              <table>
                <thead>
                  <th>ID</th>
                  <th>Description</th>
                </thead>
              <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.proposalId}</td>
                <td>{proposal.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </details>
            </div>
          </div>
        )

      }
    
      if (owned && hasVoted && status === "3") {
        return (
          <div className="owner">
            
          <div className="vote">
          <h1>
              Votez !!!
            </h1>
              
            <p>A voté !</p>



            <button onClick={status4}>
              Fin du vote
            </button>

            <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>     
            </details>
            <details>
              <summary>Tableau des propositions</summary>
              <table>
                <thead>
                  <th>ID</th>
                  <th>Description</th>
                </thead>
              <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.proposalId}</td>
                <td>{proposal.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </details>
            </div>
          </div>
        )

      }
    
      if (hasVoted && status === "3") {
        return (
          <div className="user">

          <div className="vote">
          <h1>
              Votez !!!
            </h1>
            
              <p>A voté !</p>

            <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>      
            </details>
            <details>
              <summary>Tableau des propositions</summary>
              <table>
                <thead>
                  <th>ID</th>
                  <th>Description</th>
                </thead>
              <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.proposalId}</td>
                <td>{proposal.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </details>
            </div>
          </div>
        )

      }
      
      if (status === "3") {
        return (
          <div className="user">

          <div className="vote">
          <h1>
              Votez !!!
            </h1>
            <label htmlFor="Vote">Choisissez votre proposition favorite</label>
            <br />
            <input type="number" placeholder="Id de la proposition" ref={inputVoteId} />
            <button onClick={handleVoteButtonClick}>Voter</button>

            <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>      
            </details>
            <details>
              <summary>Tableau des propositions</summary>
              <table>
                <thead>
                  <th>ID</th>
                  <th>Description</th>
                </thead>
              <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.proposalId}</td>
                <td>{proposal.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </details>
            </div>
          </div>
        )

      }
      
      if (owned && status === "4") {
        return (
          <div className="owner">

          <div className="vote">
              <h1>
                
              Fin des votes ! Merci à tous d'avoir participé ! <br />
              Les résultats seront bientôt en ligne
            </h1>
           
            <button onClick={status5}>
              Annoncer le vainqueur 
            </button>

            <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>  
            </details>
            <details>
              <summary>Tableau des propositions</summary>
              <table>
                <thead>
                  <th>ID</th>
                  <th>Description</th>
                </thead>
              <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.proposalId}</td>
                <td>{proposal.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </details>
            </div>
          </div>
        )

      }
    
      if (status === "4") {
        return (
          <div className="user">

          <div className="vote">
          <h1>
                
                Fin des votes ! Merci à tous d'avoir participé ! <br />
                Les résultats seront bientôt en ligne
              </h1>

            <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                  </thead>
                <tbody>
                {voters.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                  </tr>
                ))}
                </tbody>
              </table>     
            </details>
            <details>
              <summary>Tableau des propositions</summary>
              <table>
                <thead>
                  <th>ID</th>
                  <th>Description</th>
                </thead>
              <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.proposalId}</td>
                <td>{proposal.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </details>
            </div>
          </div>
        )

      }
      
      if (owned && status === "5") {
        return (
          <div className="owner">

          <div className="vote">
            <button onClick={getWin}>
              Découvrir le gagnant
            </button>
            <br />
            <p>Le gagnant est</p>
            
            {winner}

            <br />
            <table>
                <thead>
                  <th>Description</th>
                  <th>Nombre de voix</th>
                </thead>
              <tbody>
            {proposalsFinal.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.description}</td>
                <td>{proposal.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                    <th>ID du vote</th>
                  </thead>
                <tbody>
                {votersFinal.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                    <td>{voter.id}</td>
                  </tr>
                ))}
                </tbody>
              </table>   
            </details>
            
            </div>
          </div>
        )

      }
    
      if (status === "5") {
        return (
          <div className="user">

          <div className="vote">
            <button onClick={getWin}>
                Découvrir le gagnant
              </button>
            <br />
            <p>Le gagnant est</p>
            
            {winner}

            <br />
            <table>
                <thead>
                  <th>Description</th>
                  <th>Nombre de voix</th>
                </thead>
              <tbody>
            {proposalsFinal.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.description}</td>
                <td>{proposal.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <details>
            <summary>Liste des votants</summary>
            <table>
                  <thead>
                    <th>Adresse</th>
                    <th>ID du vote</th>
                  </thead>
                <tbody>
                {votersFinal.map(voter => (
                  <tr key={voter.id}>
                    <td>{voter.addr}</td>
                    <td>{voter.id}</td>
                  </tr>
                ))}
                </tbody>
              </table>      
            </details>
            <p></p>
            </div>
          </div>
        )

      }

      
  
  
  }
  
}

export default Workflow;