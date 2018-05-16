import React, { Component } from 'react';
import _ from 'lodash';
import './style.css';



class Token extends Component {
    constructor(props) {
        super(props);
        //console.log(props);
      }

      

     
    
      render() {

        
           

        let token = "";
        if (this.props.info !== null){
                token = <div> 
                            <p className="bold">{this.props.info.symbol} <span>{this.props.info.name}</span><span className="number">{this.props.info.totalSupply}</span></p>

                            {/* <p>Start Funding Block: {this.props.info.fundingStartBlock}</p>
                            <p>End Funding Block: {this.props.info.fundingEndBlock}</p> */}
                            
                        </div>;
        
        
            } else {
                
                token = <div className="to-start">SELECT A TOKEN TO START</div>;
                
            }
        
      return (
        <div className="Home">
         {token}
        </div>
      );
        }
 
}
    
export default Token;