import './App.css';
import web3 from './web3';
import lottery  from './lottery';
import { useEffect, useState } from "react";


function App() {


  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState([]);
  const [contractBalance, setContractBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  
  useEffect(() => {

    const init = async () => {
      const manage = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manage);
      setPlayers(players);
      setContractBalance(balance);
    };
    init();
  }, [])

  // joining lottery by sending money
  const handleSubmit = async(e) => {
      e.preventDefault();
      const accounts = await web3.eth.getAccounts();
      setMessage('Waiting on transaction success...');
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether'),
      });
      setMessage('You have been entered!');
  };

  // picking the random winner in lottery
  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessage('A winner has been picked!');
  };
  return (
    <div className="App">
      <h1>Lottery Project</h1>
      <h4>Managed by <span className="highlight"> {manager}</span></h4>
      <p>There are currently {players.length} people entered the lottery and total amount in Lottery is {web3.utils.fromWei(contractBalance, 'ether')} ETHER!</p>
      <hr />
      <h3>Try Your Luck</h3>
      <form className="" onSubmit={handleSubmit}>
        <label htmlFor="">Amount of ether :</label>
        <input style={{ margin:'10px',  marginTop: '1vh' }} value={value} type="text" onChange={(e) => setValue(e.target.value)} />
        <button style={{ margin:'10px',  marginTop: '1vh' }}>Enter</button>
      </form>
      <hr />
      <div>
        <h4>Ready to pick a winner?</h4>
        <button onClick={onPickWinner}>Pick a winner!</button>
      </div>
      <hr />
      <h2>{message}</h2>
    </div>
  );
}

export default App;

