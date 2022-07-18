import useEth from "../../contexts/EthContext/useEth";
import { useState, useRef } from "react";

function Proposals() {
  const { state: { contract, accounts, status } } = useEth();
  let options = {
    fromBlock: 0,
    toBlock: 'latest'
  };
  let voterProp = [];
  const [proposals, setProposals] = useState();
  const inputProposals = useRef(null);
  const handleProposalsButtonClick = async () => {
    await contract.methods.registerProposals(inputProposals.current.value).send({ from: accounts[0] });
    setProposals(voterProp);
  }

  if (contract) {

    contract.events.ProposalRegistered(options)
      .on('data', event => voterProp.push(event.returnValues.desc))

    contract.getPastEvents('ProposalRegistered', options)
      .then((result) => {
        result.map((addresse) => {
          voterProp.push(addresse.returnValues.desc);
          setProposals(voterProp);
        });
    }).catch((err) => {
      console.log(err);
    });

    if (status === "1") {
      return (<div>
        <input type="text" placeholder="string" ref={inputProposals} />
        <button onClick={handleProposalsButtonClick}>Ajouter un proposition</button>
        <br />
        <br />
        <br />
        {proposals}
        {/* <table>
          {voterProp.map((addresse) => (
            <tr>
              <td>{addresse.desc}</td>
              <td>{addresse.proposalId}</td>
              <td>{addresse.voteCount}</td>
            </tr>
          ))}
        </table> */}
      </div>
      );
    }else{
      
      return (
        <div>
          
        {proposals}
      </div>
        )
      };
    
  }
}

export default Proposals;