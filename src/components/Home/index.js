import React, { Component } from 'react';
import Web3 from 'web3';
import _ from 'lodash';
import { Link } from 'react-router-dom'
import './style.css';

var web3 = new Web3('http://localhost:8545');//new Web3(new Web3.providers.HttpProvider('http://localhost:8546'));

var erc20Abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"}];



var s = web3.eth.getBlock('latest');





class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
          block_ids: [],
          block_hashes: [],
          curr_block: null
        }
      }

      componentDidMount() {
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
                //var na = token.methods.symbol().call().then(console.log);
        });

       
        
       
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

    render() {
        var tableRows = [];
_.each(this.state.block_ids, (value, index) => {
  tableRows.push(
    <tr key={this.state.block_hashes[index]}>
      <td className="tdCenter">{this.state.block_ids[index]}</td>
      <td><Link to={`/block/${this.state.block_hashes[index]}`}>{this.state.block_hashes[index]}</Link></td>
    </tr>
  )
});



return (
    <div className="Home">
      <h2>HOME</h2>
      <p>Current Block: {this.state.curr_block} </p>

      <table>
        <thead><tr>
          <th>Block No</th>
          <th>Hash</th>
        </tr></thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </div>
  );
    }
}

export default Home;