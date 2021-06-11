const dotenv = require('dotenv');
const axios = require('axios').default;

dotenv.config();

const WotGameId = 27546;
const dropTagId = 'c2542d6d-cd10-4532-919b-3d19f30a768b';

async function start() {
	const access_token = await axios
		.post(
			`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
		)
		.then((res) => res.data.access_token);

	if (access_token) {
		const streams = await axios
			.get(`https://api.twitch.tv/helix/streams?game_id=${WotGameId}`, {
				headers: {
					Authorization: `Bearer ${access_token}`,
					'client-id': process.env.TWITCH_CLIENT_ID,
				},
			})
			.then((res) => res.data.data);

		const streamsWithDrops = streams.filter((stream) => stream.tag_ids.includes(dropTagId));

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
