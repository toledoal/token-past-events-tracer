import React, { Component } from 'react';
import Web3 from 'web3';
import _ from 'lodash';
import Loader  from 'react-loader';

import { Link } from 'react-router-dom'
import TokenInfo from '../../models/tokens.json';
import Token from '../Tokens/Token';
import Canvas from '../Tokens/Canvas';
import InputDataDecoder from '../../models/ethereum-input-decoder';
import Charts from '../Charts';


import './style.css';


var web3 = new Web3('http://localhost:8545');

var erc20Abi = [
    {
        "constant":true,
        "inputs":[],
        "name":"name",
        "outputs":[{"name":"","type":"string"}],
        "payable":false,"type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"symbol",
        "outputs":[{"name":"","type":"string"}],
        "payable":false,"type":"function"
    },
    {   "constant":true,
        "inputs":[],
        "name":"totalSupply",
        "outputs":[{"name":"","type":"uint256"}],
        "payable":false,
        "type":"function"
    },
    {   "constant":true,
        "inputs":[],
        "name":"decimals",
        "outputs":[{"name":"","type":"uint8"}],
        "payable":false,"type":"function"
    },
    {   "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "payable":false,"type":"function"
    }
];

var txABI = [{
    "type":"function",
    "inputs": [{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],
    "name":"transfer",
    "outputs": []
    },
    {
        "type":"function",
        "inputs": [{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],
        "name":"approve",
        "outputs": []
        }
];

const decoder = new InputDataDecoder(txABI);

let transactions = [];


class Tokens extends Component {
    constructor(props) {
        super(props);
        this.state = {
          block_ids: [],
          block_hashes: [],
          curr_block: null,
          curatedTokens: TokenInfo.tokens,
          currentToken: null,
          currentPastEvents: null,
          currentTransaction: null,
          tokenTransactions: [],
          chartInfo: [],
          chartLoaded: true,
        }
      }

      componentDidMount() {
        this.setState({ curatedTokens: TokenInfo.tokens})
        
        var curr_block_no;
        web3.eth.getAccounts().then(accounts => console.log(accounts));
        web3.eth.getBlockNumber().then(number => {
            curr_block_no = number;
            console.log(curr_block_no);
            console.log(web3.currentProvider);
            this.setState({
                curr_block: curr_block_no
              });

              this.getBlocks(curr_block_no);

              var tokenAddress = "0xd0d6d6c5fe4a677d343cc433536bb717bae167dd";
             

                var token = new web3.eth.Contract(erc20Abi, tokenAddress);
                console.log(token);

                
                var t = token.methods.totalSupply().call().then(console.log);
                var na = token.methods.name().call().then(console.log);
                var na = token.methods.symbol().call().then(console.log);

                
               

                
        }); 
       
      }

      async getEvents(token){
        let events = await token.getPastEvents('allEvents',{ fromBlock:5598000 });
        console.log(events);
        this.setState({
            currentPastEvents: events
        })
        return events;
        
      }

      async getTransactions(events){
        var that = this;
        transactions =[];

        events.map(event => {
            that.getTxData(event.transactionHash);
        });

        setTimeout(function(){
            
           
            console.log(transactions);


            let txData= transactions.map((tx, i) => {
                return {x: i, y: (tx.gas/10000), size: (parseInt(tx.value)/100000000000000000), hash: tx.hash, nonce: tx.nonce, }
            });

            that.setState({
                tokenTransactions: transactions,
                chartInfo: txData,
                chartLoaded: true,
             });
          }, 1500)
       
         
       
      }

      getTxData(txHash){
        web3.eth.getTransaction(txHash).then(tx => {
            const result = decoder.decodeData(tx.input);
            tx.decodedInput = result;
            if (tx.decodedInput.inputs !== undefined){
            let txPlot = {
                block: tx.blockNumber,
                type: tx.decodedInput.name,
                hash: tx.hash,
                gas: tx.gas,
                gasPrice: tx.gasPrice,
                value: tx.decodedInput.inputs[1].toString(),
                nonce: tx.nonce,
            }
            transactions.push(txPlot);
            }
        }
        );
      }

      async getBlocks(curr_block_no) {
        const block_ids = this.state.block_ids.slice();
        const block_hashes = this.state.block_hashes.slice();
        var max_blocks = 10;
        if (curr_block_no < max_blocks) max_blocks = curr_block_no;
        for (var i = 0; i < max_blocks; i++, curr_block_no--) {
          var currBlockObj = await web3.eth.getBlock(curr_block_no);
          block_ids.push(currBlockObj.number);
          block_hashes.push(currBlockObj.hash);
        }
        this.setState({
          block_ids: block_ids,
          block_hashes: block_hashes
        })
      }

    getTokenInfo = (e) => {
        if (e.target !== undefined){
        this.setState({currentToken:null, chartInfo: [], chartLoaded: false});
        this.getToken(e.target.id).then(x=>{

            x[0].totalSupply = parseInt(x[0].totalSupply)/1e18;

            this.setState({currentToken:x[0]});
            this.getEvents(x[1]).then(x=>
               this.getTransactions(x)
            )
            
          });
        }
    }



    async getToken(address) {
      if (address !== null){
      var token = new web3.eth.Contract(erc20Abi, address);

      
      var totalSupply = await token.methods.totalSupply().call();
      var name = await token.methods.name().call();
      var symbol = await token.methods.symbol().call();
      console.log(token);

      return [{name, symbol, totalSupply },token];
    }
    }

    render() {
        var tokenList = [];
    _.each(this.state.curatedTokens, (token, index) => {
        tokenList.push(
            <div onClick={this.getTokenInfo} key={index} id={token}>
              <img className="token" src={`./icons/${token.Icon}`} id={token.Address}/>
              <p>{token.Symbol}</p>  
            </div>
        )});



    return (
    <div className="Tokens">
      <div className="column-a">
      <Token info={this.state.currentToken}/>
      <div className="table">{tokenList}</div>
      </div>  
      <div className="column-b"> 
      <Loader className="loader-voronoi" loaded={this.state.chartLoaded}>
      <Charts data={this.state.chartInfo === [] ? [] : this.state.chartInfo}/>
      </Loader>
      </div>
    </div>
    )
    }
}
// <Canvas transactions={this.state.tokenTransactions}/>
export default Tokens;