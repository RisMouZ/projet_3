// import useEth from "../../contexts/EthContext/useEth";
// import { useState, useRef } from "react";

// function Array() {
//   const { state: { contract, accounts, owned, status } } = useEth();
//   let options = {
//     fromBlock: 0,
//     toBlock: 'latest'
//   };
//   let voterAdd = [];
//   const [voter, setVoter] = useState();
//   const inputVoter = useRef(null);
//   const handleButtonClick = async () => {
//     await contract.methods.registerVoters(inputVoter.current.value).send({ from: accounts[0] });
//     setVoter(voterAdd);
//   }


//   if (contract) {
//     contract.getPastEvents('VoterRegistered', options)
//       .then((result) => {
//         result.map((addresse) => {
//           voterAdd.push(addresse.returnValues.voterAddress);
//           setVoter(voterAdd);
//         });
//     }).catch((err) => {
//       console.log(err);
//     });


//     if (owned && status === "0") {
//       return (<div>
//         <input type="text" placeholder="address" ref={inputVoter} />
//         <button onClick={handleButtonClick}>Ajouter un voter</button>
//         {voter}
//       </div>
//       );
//     } else{
      
      
//       return (
//         <div>
          
//         {voter}
//       </div>
//         )
//       };
//   }

// }

// export default Array;