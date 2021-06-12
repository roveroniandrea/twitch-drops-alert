const dotenv = require('dotenv');
const axios = require('axios').default;

dotenv.config();

const WotGameId = 27546;


async function start() {
	

	if (access_token) {
		

		if (streamsWithDrops && streamsWithDrops.length > 0) {
			console.log('Trovati stream con drop:');
			streamsWithDrops.forEach((str) => {
				console.log(`https://www.twitch.tv/${str.user_login}`);
			});
		} else {
			console.log('Nessun stream con i drop');
		}
	} else {
		console.log('No access token');
	}
}

start();
