import {shortAddress} from "../utils/address";
import React, {useEffect, useState} from "react";
import {getProgram, baseAccount, getConnection, CLUSTER} from "../utils/connection";
import {web3} from "@project-serum/anchor";
import Solana from "../assets/solana-logo.svg";

const {SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey} = web3;

export default function GifItem({item, sender}) {
  const {gifLink, userAddress, votes} = item;
  const [vote, setVote] = useState(() => typeof votes === 'number' ? votes : 0);
  const [msg, setMsg] = useState(null);
  const [amount, setAmount] = useState(0.001);

  const txLink = (msg, tx) => (
    <a
      className="tx-link"
      href={new URL(`https://solscan.io/tx/${tx}?cluster=${CLUSTER}`)}
      target={"_blank"}
      rel={"noreferrer noopener"}
    >
      {msg}
    </a>
  );


  useEffect(() => {
    const id = setTimeout(() => {
      setMsg(null);
    }, 5000);

    return () => clearTimeout(id);
  }, [msg]);

  const handleVote = async () => {
    try {
      const tx = await getProgram().rpc.vote(
        {
          gifLink,
          userAddress: userAddress.publicKey
        },
        {
          accounts: {
            baseAccount: baseAccount.publicKey
          }
        }
      );

      await getConnection().confirmTransaction(tx);
      setMsg(txLink("Thanks for voting! ❤. Click me to see the Tx", tx));
      setVote(prevVote => prevVote + 1);
    } catch (err) {
      setMsg(err.message);
    }

  }

  const handleTx = async () => {
    try {
      const connection = getConnection();
      const tx = new Transaction();
      const senderPk = new PublicKey(sender);

      tx.add(
        SystemProgram.transfer({
          fromPubkey: senderPk,
          toPubkey: userAddress,
          lamports: LAMPORTS_PER_SOL * amount
        })
      );


      tx.feePayer = senderPk;
      tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

      const {signature} = await window.solana.signAndSendTransaction(tx);
      await connection.confirmTransaction(signature);

      setMsg(txLink("Good choice 🤩!. Click to see the Tx", signature));
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="gif-item">
      <img className="gif" src={gifLink} alt={gifLink}/>
      <p className="sub-text">Sent by: {shortAddress(userAddress.toString())}</p>
      <button className="cta-button vote-btn" onClick={handleVote}>Votes {vote} ❤️</button>
      <div className="tip-box">
        <input className="tip-input" min={0.0001} type={"number"} value={amount}
               onChange={(e) => setAmount(+e.target.value)}/>
        <img className="sol" alt={"SOL"} src={Solana}/>
        <button className="cta-button tip-btn" onClick={handleTx}>Like this gif? Give a tip 💰</button>
      </div>
      {msg && <p className="sub-text">{msg}</p>}
    </div>
  );
}