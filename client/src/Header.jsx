import useEth from "./contexts/EthContext/useEth";

function Header() {
  const { state: { contract, accounts } } = useEth();

  if (contract)
    return (
      <div className="header">
        <span>{accounts[0]}</span>
      </div>
    )
}

export default Header