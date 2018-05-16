import React, { Component } from 'react';
import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';



class Debug extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: [],
        }
      }



  
      render() {

        let structuredData = this.props.data !== null ? this.props.data.structLogs.map(log => {
            return <p key={log.pc}>{"op code: " + log.op + " and PC Number: " + log.pc}</p>
        }) : "";

        //let structuredData = JSON.stringify(this.props.data);
  
        let json = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.props.data));
  
      return (
          this.props.data !== null ?
            <div className="debug">
            <a href={json} download="data.json">download JSON</a>
            {structuredData}
            </div>
            : ""
        )
      }
  }
  // <Canvas transactions={this.state.tokenTransactions}/>
  export default Debug;