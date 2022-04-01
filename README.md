# GIF Portal
Built on buildspace

## Deploy in localnet
1. In `Anchor.toml` change line 3 to `[programs.localnet]` and line 10 `cluster = "localnet"`
2. Run `anchor build`
3. This will create a new build for us with a program id. We can access it by running: `solana address -k target/deploy/myepicproject-keypair.json`
4. Go to lib.rs and change the id inside `declare_id!`
5. Run again `anchor build`
6. Finally `anchor deploy`

I know, a lot of steps ... 😅

## Deploy in devnet
Same as before but with `[programs.devnet]` and `cluster = "devnet"` respectively

## Upgrade the program

Run `anchor upgrade target/deploy/gif_portal.so --provider.cluster cluster --program-id program_id`
> cluster could be localnet or devnet