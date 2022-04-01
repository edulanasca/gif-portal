import React from "react";

export default function WalletNotExists() {
  return (
    <div>
      <p className="sub-text">Wallet not found!
        <a
          href="https://phantom.app/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Install Phantom Wallet 👻
        </a>
      </p>
    </div>
  )
}