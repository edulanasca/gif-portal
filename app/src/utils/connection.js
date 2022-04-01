import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import {Program, Provider, web3} from "@project-serum/anchor";
import idl from "../idl.json";

const arr = Object.values(JSON.parse(import.meta.env.VITE_KEYPAIR.toString())._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const NETWORK = clusterApiUrl('devnet');
export const CLUSTER = "devnet";

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

const getConnection = () => new Connection(NETWORK, opts.preflightCommitment);

// This is basically us creating a provider which is an authenticated connection to Solana
const getProvider = () => {
  return new Provider(
    getConnection(), window.solana, opts.preflightCommitment,
  );
}

const getProgram = () => new Program(idl, programID, getProvider());

export {
  getConnection,
  getProvider,
  getProgram,
  baseAccount
}