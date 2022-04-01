import React from "react";

export default function WalletNotConnected({setWalletAddress}) {
  const connectWallet = async setWalletAddress => {
    const {solana} = window;

    if (solana) {
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    }
  };

  return (
    <button
      className="cta-button connect-wallet-button"
      onClick={() => connectWallet(setWalletAddress)}
    >
      Connect to Wallet
    </button>
  );
}