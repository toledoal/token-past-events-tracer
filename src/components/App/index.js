import React, { Component } from 'react';
import logo from './logo.svg';
import './style.css';
import Block from './../Block';
import Home from './../Home';
import Tokens from './../Tokens';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>CURATED TOKENS EXPLORER</h2>
        </div>
        <div className="App-nav">
        <Router>
  <div>
    <div className="menu-buttons">
    <Link to="/">HOME</Link>
    <Link to="/block">BLOCK</Link>
    <Link to="/Tokens">PAST EVENTS TOKEN TRACKER</Link>
    </div>
    <Route exact path="/" component={Home}/>
    <Route exact path="/Tokens" component={Tokens}/>
    <Route exact path="/block" render={() => (
      <h3>Please select a blockHash.</h3>
    )}/>
    <Route path="/block/:blockHash" component={Block}/>
  </div>
</Router>
        </div>
      </div>
    );
  }
}
export default App;