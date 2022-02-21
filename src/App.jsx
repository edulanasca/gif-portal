import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

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

  const renderConnectedContainer = () => (
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
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif}/>
          </div>
        ))}
      </div>
    </div>
  )

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [])

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');

      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
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
