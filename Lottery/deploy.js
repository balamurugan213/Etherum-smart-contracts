const HDWalletProvider=require('truffle-hdwallet-provider')
const Web3=require('web3')
const {interface,bytecode}=require('./compile')

const provider=new HDWalletProvider('enter your seed phrase(nemonics)','<enter infura endpoint link>');

const web3=new Web3(provider);

const deploy =async()=>{
    const accounts = await web3.eth.getAccounts();
    console.log('Attemptin to deploy :',accounts[0])

const result= await new web3.eth.Contract(JSON.parse(interface)).deploy({data:'0x' + bytecode, arguments:[]}).send({from:accounts[0]});

console.log('contract deployed to :',result.options.address)
console.log('Interface :',interface)

}
deploy();