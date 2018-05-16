import React, { Component } from 'react';
import {scaleLinear} from 'd3-scale';
import Web3 from 'web3';
import Debug from '../Charts/debug';
import Loader  from 'react-loader';
import {
    Crosshair,
    HorizontalGridLines,
    MarkSeries,
    VerticalGridLines,
    XAxis,
    XYPlot,
    YAxis,
    Voronoi
  } from 'react-vis';

  var web3 = new Web3('http://localhost:8545');
      // DEBUG
  web3.extend({
      property: 'debug',
      methods:
      [
          new web3.extend.Method({
              name: 'traceTransaction',
              call: 'debug_traceTransaction',
              params: 2,
            // inputFormatter: [web3.extend.formatters.formatInputString, web3.extend.formatters],
            // outputFormatter: web3.extend.formatters.formatOutputString
          }),
      ]
  });
  
  const DATA = [
    {x: 1, y: 4, size: 9},
    {x: 1, y: 5, size: 18},
    {x: 1, y: 10, size: 5},
    {x: 1, y: 11, size: 29},
    {x: 1, y: 13.9, size: 5},
    {x: 1, y: 14, size: 8},
    {x: 1.5, y: 11.8, size: 25},
    {x: 1.7, y: 9, size: 30},
    {x: 2, y: 5, size: 11},
    {x: 2.1, y: 11.8, size: 28},
    {x: 2.4, y: 7.9, size: 14},
    {x: 2.4, y: 13.5, size: 20},
    {x: 2.7, y: 13.7, size: 14},
    {x: 2.9, y: 7.7, size: 26},
    {x: 3, y: 5.4, size: 6}
  ];
  
  const x = scaleLinear()
    .domain([1, 100])
    .range([20, 600]);
  const y = scaleLinear()
    .domain([0, 2])
    .range([0, 1000]);

  

 class Charts extends React.Component {
        state = {
          data: DATA,
          selectedPointId: null,
          showVoronoi: true
        }

        constructor(props) {
            super(props);

            this.state = {
                data: this.props.data,
                transactionData: this.props.data,
                selectedPointId: null,
                showVoronoi: true,
                selectedTransaction: null,
                transactionTraceData: null,
                tracedLoaded: true,
                selectedValue: null,
                selectedNonce: null,
            }
        }
      
        /**
         * Event handler for onNearestXY.
         * @param {Object} value Selected value.
         * @private
         */
        _onNearestXY = (value, {index}) => {
          this.setState({selectedPointId: index, selectedTransaction: value.hash, selectedValue: value.size, selectedNonce: value.nonce});
          
        }

         /**
         * Event handler for onNearestXY.
         * @param {Object} value Selected value.
         * @private
         */
        _onClick = (e) => {
          this.setState({tracedLoaded: false});
          //let tracer = {tracer: '{data: [], fault: function(log){ return log; }, step: function(log) { if(log.op.toString() == "CALL") this.data.push(log.stack.peek(0)); }, result: function() { return this.data; }}'};
          let transaction = web3.debug.traceTransaction(this.state.selectedTransaction, {});
          transaction.then( x => this.setState({transactionTraceData: x, tracedLoaded: true}))
          .catch(e => { 
            alert("Info Unavailable" + e);
            this.setState({tracedLoaded: true}); 
          });
        }

      
        /**
         * Event handler for onMouseLeave.
         * @private
         */
        _onMouseLeave = () => {
          this.setState({selectedPointId: null});
        }
      
        render() {
          const {transactionData, selectedPointId, showVoronoi} = this.state;
          const dat = this.props.data;
          const datos = this.props.data.map(tx => { return {x: tx.x, y : tx.nonce }} );
          return (
            <div>
              { this.props.data.length !== 0 ? 
              <div>
              <label style={{display: 'block'}}>
                <input type="checkbox"
                  checked={showVoronoi}
                  onChange={e => this.setState({showVoronoi: !showVoronoi})}
                />
                Show Voronoi
              </label>
              
              <p style={{fontSize:"12px", textAlign:"left"}}>Past Transfer Events for Selected Token since Block 5598000</p>
              <p style={{fontSize:"10px", textAlign:"left"}}>Transaction Hash: {this.state.selectedTransaction}</p>
              <p style={{fontSize:"10px", textAlign:"left"}}>Transfer Value: {this.state.selectedValue}</p> 
              <p style={{fontSize:"10px", textAlign:"left"}}>Nonce: {this.state.selectedNonce}</p> 
              </div>
              : ""
              }
              <XYPlot
                onMouseLeave={this._onMouseLeave}
                onClick={this._onClick}
                width={600}
                height={600}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <MarkSeries
                  className="mark-series-example"
                  colorType="literal"
                  data={dat.map((point, index) =>
                    ({...point, color: selectedPointId === index ? '#FF9833' : '#12939A'}))}
                  onNearestXY={this._onNearestXY}
                  sizeRange={[2, 70]} />
                <Crosshair values={this.state.crosshairValues}/>
                <Voronoi
                  extent={[[0, 0], [600, 600]]}
                  nodes={datos}
                  polygonStyle={{stroke: showVoronoi ? 'rgba(0, 0, 0, .2)' : null}}
                  x={d => x(d.x)}
                  y={d => y(d.y)}
                />
              </XYPlot>
              <Loader className="loader" loaded={this.state.tracedLoaded}>
              <Debug data={this.state.transactionTraceData} />
              </Loader>
            </div>
          );
        }
      }

export default Charts;