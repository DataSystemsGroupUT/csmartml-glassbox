import React from 'react';
import logo from './logo.svg';
import './App.css';

import HyperPartitions from "./themes/HyperPartitions";
import HomeBasicLight from "./themes/HomeBasicLight";


class App extends React.Component {

  render(): React.ReactNode {
    return (
      <HomeBasicLight />
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.tsx</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactzwjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
    );
  }
}


export default App;
