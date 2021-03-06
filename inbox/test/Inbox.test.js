const assert=require('assert');
const ganache =require('ganache-cli');
const internal = require('stream');
const Web3=require('web3');
// const web3 =new Web3(ganache.provider())
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface,bytecode}=require('../compile')

let accounts;
let inbox;

beforeEach(async ()=> {
    // Get a list of all eth account
    accounts = await web3.eth.getAccounts();

    // Use one of the account to deploy

    // the contract
    inbox=await new web3.eth.Contract(JSON.parse(interface)).deploy({data:bytecode,arguments:[]}).send({from:accounts[0],gas:'1000000'})
    inbox.setProvider(provider);
})

describe('co',()=>{
    it('deploy contract',()=>{
        assert.ok(inbox.options.address);

    })

    it('has a initial value',async()=>{
        const message=await inbox.methods.count().call();
        assert.equal(message,1);
        // assert.strictEqual
    })

    it('can increase the value',async()=>{
        const oldMessage=await inbox.methods.count().call();
        await inbox.methods.inc().send({from:accounts[0]})
        const message=await inbox.methods.count().call();

        assert.equal( message,parseInt(oldMessage)+1);
    })


})