const assert=require('assert'); //builtin liberary
const ganache =require('ganache-cli');
const Web3=require('web3');
// const web3 =new Web3(ganache.provider())
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface,bytecode}=require('../compile')


let lottery;
let accounts;

beforeEach(async()=>{
    accounts=await web3.eth.getAccounts();

    lottery=await new web3.eth.Contract(JSON.parse(interface)).deploy({data:bytecode,arguments:[]}).send({from:accounts[0],gas:'1000000'})

    lottery.setProvider(provider);
})

describe('Lottery Contract',()=>{
    it('deploys a contract',()=>{
        assert.ok(lottery.options.address)
    });

    it('Allow one account to enter',async()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('0.2','ether')
        });

        const players =await lottery.methods.getPlayers().call({
            from:accounts[0]
        });

        assert.equal(accounts[0],players[0])
        assert.deepStrictEqual(1,players.length)

    })

    it('Allow multiple account to enter',async()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('0.2','ether')
        });
        await lottery.methods.enter().send({
            from:accounts[1],
            value: web3.utils.toWei('0.2','ether')
        });
        await lottery.methods.enter().send({
            from:accounts[2],
            value: web3.utils.toWei('0.2','ether')
        });

        const players =await lottery.methods.getPlayers().call({
            from:accounts[0]
        });

        assert.equal(accounts[0],players[0])
        assert.equal(accounts[1],players[1])
        assert.equal(accounts[2],players[2])
        assert.deepStrictEqual(3,players.length)

    });

    it('I requires minimum no of ether',async()=>{
        try{
            await lottery.methods.enter().send({
                from:accounts[0],
                value: web3.utils.toWei('0.001','ether')
            });
            assert(false)
        }catch(err) {
            assert(err);
        } 
    });

    it('only manager call pickwinner',async()=>{
        try{
            await lottery.methods.pickWinner().send({
                from:accounts[1]
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it('sends money to winner and reset players',async()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('2','ether')
        });
        const initaial =await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from:accounts[0]
        });

        const finalBalance =await web3.eth.getBalance(accounts[0]);
        const  difference=finalBalance- initaial;
        assert(difference>web3.utils.toWei('1.8','ether'))

    })

})