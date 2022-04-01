import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {GifPortal} from "../target/types/gif_portal";
import {expect} from "chai";

describe("gif-portal", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GifPortal as Program<GifPortal>;
  const baseAccount = anchor.web3.Keypair.generate();

  const getBaseAccount = async () => await program.account.baseAccount.fetch(baseAccount.publicKey);

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [baseAccount]
    });

    console.log("Your transaction signature", tx);
  });

  it("Adds 10 gif and fetches total gifs from the account", async () => {
    let account = await getBaseAccount();

    expect(account.totalGifs.toString()).to.equal("0");

    for (let i = 0; i < 10; i++) {
      await program.rpc.addGif("https://media.giphy.com/media/HcmeBxVSg8YGA/giphy.gif" + i, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey
        }
      });
    }

    account = await getBaseAccount();
    expect(account.totalGifs.toString()).to.equal("10");
    console.log("GIF list", account.gifList);
  });

  it("Votes for a gift", async () => {

    await program.rpc.vote({
        gifLink: "https://media.giphy.com/media/HcmeBxVSg8YGA/giphy.gif0",
        userAddress: provider.wallet.publicKey
      },
      {
        accounts: {
          baseAccount: baseAccount.publicKey
        }
      }
    );

    let account = await getBaseAccount();
    expect(account.gifList[0].votes.toString()).to.equal("1");

  });
});
