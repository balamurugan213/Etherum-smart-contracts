import Web3 from "web3";

const ethEnabled = async () => {
    if (window.ethereum) {
        await window.ethereum.send('eth_requestAccounts');
        window.web3 = new Web3(window.ethereum);
        return true;
    }
    return false;
}
ethEnabled()
const web3 =new Web3(window.web3.currentProvider);

export default web3;