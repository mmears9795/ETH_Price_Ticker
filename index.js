import fetch from 'node-fetch';

import { Client, Intents, Guild, BitField } from 'discord.js';

import dotenv from 'dotenv';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let previousPrice = 0

bot.on("ready", () => {
    console.log("The bot is ready");

    bot.user.setActivity("ETH Price", {type: 'WATCHING'});

    const priceCheckInterval = setInterval (async function () {
	try {
        	let ETHprice = await getETHPrice();
		
		if (ETHprice != previousPrice) {
			console.log("Previous price " + previousPrice);
			console.log("New price: " + ETHprice);
			let guilds = bot.guilds.cache.map(guild => guild.id);
			guilds.forEach((id) => {
				let guild = bot.guilds.cache.get(id);
				guild.me.setNickname("$" + ETHprice);
			});
		}
		previousPrice = ETHprice;
	} catch(error) {
		console.log(error)
	}
    }, 15000);

});

async function getETHPrice() {
    try {
            const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                }
            });
    
            const data = await response.json();
    
            return data.ethereum.usd;
    } catch(error) {
	console.log(error);    
        getETHPrice();
    }
}

bot.login(process.env.DISCORD_BOT_TOKEN);
