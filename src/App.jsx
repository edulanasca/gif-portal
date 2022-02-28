import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

import {clusterApiUrl, Connection, PublicKey} from '@solana/web3.js';
import {Program, Provider, web3} from '@project-serum/anchor';
import idl from 'idl.json';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
let baseAccount = Keypair.generate();

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const SNK_URL_IMG = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/dfee3ac0-96c7-4f20-bef9-ffeaad744b5f/d6n04bi-2eb6bbc3-57be-49b1-a463-99aeee936e95.png';
const TEST_GIFS = [
  'https://media.giphy.com/media/3ohzdLD2vN09ZavdqU/giphy.gif',
  'https://media.giphy.com/media/kgo9KtvX2dCVudr645/giphy.gif',
]

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const {solana} = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Wallet Phantom found");

          const response = await solana.connect({onlyIfTrusted: true});
          console.log(response);
          console.log('Connected with Public key', response.publicKey.toString());
        } else {
          alert('Solana object not found! Get a Phantom Wallet 👻');
        }
      }

    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    const {solana} = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    }
  }

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const handleChange = (event) => setInputValue(event.target.value);

  // This is basically us creating a provider which is an authenticated connection to Solana
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    return new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
  }

  const renderConnectedContainer = () => {
    // If we hit this, it means the program account hasn't been initialized.
    if (gifList == null) {
      return (
        <div className="connected-container">
          <button className="cta-button submit-gif-button" onClick={createGifAccount}>
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      )
    } else {
      return (
        <div className="connected-container">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendGif();
            }}
          >
            <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={handleChange}/>
            <button type="submit" className="cta-button submit-gif-button">Submit</button>
          </form>
          <div className="gif-grid">
            {gifList.map((gif, index) => (
              <div className="gif-item" key={index.toString()}>
                <img src={gif} alt={gif}/>
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [])

  const getGifList = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

      console.log("Got the account", account);
      setGifList(account.gifList);
    } catch (err) {
      console.log("Error in getGifList ", err);
      setGifList(null);
    }
  }

  const createdGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping");

      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        }
      });

      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString());
      await getGifList();
    } catch (err) {
      console.log("Error creating BaseAccount account:", err);
    }
  }

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');

      // Call Solana program here.
      getGifList();
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header"><img className='snk-logo' src={SNK_URL_IMG} alt='Snk logo'/> SNK Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo}/>
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
