use anchor_lang::prelude::*;

declare_id!("HdbGrTGCuGuL1JWEQ3bwVAT3TVEXjYJaW4gNQfkLpr2F");

#[program]
pub mod gif_portal {
    use super::*;

    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result<()> {
        // Get a reference to the account.
        let base_account = &mut ctx.accounts.base_account;
        // Initialize total_gifs.
        base_account.total_gifs = 0;
        Ok(())
    }

    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        let item = GifItem {
            gif_link: gif_link.to_string(),
            votes: 0,
            user_address: *user.to_account_info().key,
        };

        base_account.gif_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, gif_info: GifInfo) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account
            .gif_list
            .iter_mut()
            .for_each(|item|
                if item.gif_link == gif_info.gif_link || item.user_address == gif_info.user_address
                { item.votes += 1 }
            );

        Ok(())
    }
}

// Attach certain variables to the StartStuffOff context.
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

// Create a custom struct for us to work with. 89 bytes
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct GifItem {
    pub gif_link: String,
    pub votes: u32,
    pub user_address: Pubkey,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct GifInfo {
    pub gif_link: String,
    pub user_address: Pubkey,
}

// Tell Solana what we want to store on this account.
#[account]
pub struct BaseAccount {
    pub total_gifs: u32,
    pub gif_list: Vec<GifItem>,
}

