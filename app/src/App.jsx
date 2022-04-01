import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

import WalletNotConnected from "./components/WalletNotConnected";
import WalletConnected from "./components/WalletConnected";
import WalletNotExists from "./components/WalletNotExists";
import {getTwitterLink, SNK_URL_IMG} from "./utils/links";

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletExists, setWalletExists] = useState(false);


  const checkIfWalletExists = () => {
    try {
      setWalletExists(window.solana);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.addEventListener('load', checkIfWalletExists);
    return () => window.removeEventListener('load', checkIfWalletExists);
  }, []);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header gradient-text">
            <img className='snk-logo' src={SNK_URL_IMG} alt='Snk logo'/> SNK Portal
          </p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {
            walletExists ?
              (!walletAddress && <WalletNotConnected setWalletAddress={setWalletAddress}/>) :
              <WalletNotExists/>
          }
          {walletAddress && <WalletConnected walletAddress={walletAddress}/>}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo}/>
          <div>
            <a
              className="footer-text"
              href={getTwitterLink('_buildspace')}
              target="_blank"
              rel="noreferrer"
            >built on @_buildspace</a>
            <br/>
            <a
              className="footer-text"
              href={getTwitterLink('edulanasca')}
              target="_blank"
              rel="noreferrer"
            >
              modified by @edulanasca
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
