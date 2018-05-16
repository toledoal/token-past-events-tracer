
import React, { Component } from 'react';
import _ from 'lodash';
import './style.css';



class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trans : []
        }
      }

    //   componentWillReceiveProps(nextProps) {
    //     if (this.props.transactions !== nextProps.transactions) {
    //       this.setState({trans: nextProps.transactions});
    //     }
    //   }
    
     
    
      render() {




var transaction_list = []; 
        


// block: tx.blockNumber,
//                 type: tx.decodedInput.name,
//                 hash: tx.hash,
//                 gas: tx.gas,
//                 gasPrice: tx.gasPrice,
//                 value: tx.decodedInput.inputs[1].toString(),

//if (this.props.transactions !== null){
    _.each(this.props.transactions, (tx, index) =>  {
        transaction_list.push(
        <div className="transaction-info" key={index}>
        <p>{tx.hash}</p>
        <p>{tx.type}</p>
        <p>{tx.block}</p>
        <p>{tx.gas}</p>
        <p>{tx.gasPrice}</p>
        <p>{tx.value}</p>
        </div>)
        });
  //  } 
    
    return (
        <div className="table">
         {transaction_list}
        </div>
      );
        }
 
}
    
export default Canvas;