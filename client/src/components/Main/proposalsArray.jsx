import useEth from "../../contexts/EthContext/useEth";
import { useState, useRef, useEffect } from "react";

function Proposals() {
  const { state: { contract, accounts, status, voter } } = useEth();
  let options = {
    fromBlock: 0
  };
  let voterProp = [];
  const [proposals, setProposals] = useState();
  const input = useRef(null);
  const handleButtonClick = async () => {
    await contract.methods.registerProposals(input.current.value).send({ from: accounts[0] });
    setProposals(voterProp);
  }


  if (contract) {
    contract.events.ProposalRegistered(options)
    .on('data', event => voterProp.push(event.returnValues))

    if (status === "1" && voter) {
      console.log(voterProp);
      return (<div>
        <input type="text" placeholder="string" ref={input} />
        <button onClick={handleButtonClick}>Ajouter un proposition</button>
        <table>
          {voterProp.map((addresse) => (
            <tr>
              <td>{addresse.returnValues.desc}</td>
              <td>{addresse.returnValues.proposalId}</td>
              <td>{addresse.returnValues.voteCount}</td>
            </tr>
          ))}
        </table>
      </div>
      );
    } else if (!voter) {
      return (
        <div>
          <p>Mon Zgueg</p>
        </div>
      )
    }else
    {
      
      return (
        <div>
          
        {proposals}
      </div>
        )
      };
    
  }
}

export default Proposals;