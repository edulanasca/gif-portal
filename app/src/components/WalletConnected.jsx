import React, {useEffect, useState} from "react";
import {web3} from "@project-serum/anchor";
import {getProgram, baseAccount, getProvider} from "../utils/connection";
import GifItem from "./GifItem";

// SystemProgram is a reference to the Solana runtime!
const {SystemProgram} = web3;

export default function WalletConnected({walletAddress}) {
  const [gifList, setGifList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => setInputValue(event.target.value);

  useEffect(async () => {
    if (walletAddress) {
      // Call Solana program here.
      await getGifList();
    }
  }, [walletAddress]);

  const getGifList = async () => {
    try {
      const account = await getProgram().account.baseAccount.fetch(baseAccount.publicKey);
      setGifList(account.gifList);
    } catch (err) {
      console.log("Error in getGifList ", err);
      setGifList(null);
    }
  }

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = getProgram();

      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        },
        signers: [baseAccount]
      });

      await getGifList();
    } catch (err) {
      console.log("Error creating BaseAccount account:", err);
    }
  }

  const sendGif = async () => {
    if (inputValue.length === 0) {
      return
    }
    setInputValue('');

    try {
      const provider = getProvider();
      const program = getProgram();

      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully sent to program", inputValue)

      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error)
    }
  }

  // If we hit this, it means the program account hasn't been initialized.
  if (gifList == null) {
    return (
      <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    );
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
          {gifList.map((item, index) => <GifItem key={index.toString()} item={item} sender={walletAddress}/>)}
        </div>
      </div>
    );
  }
}