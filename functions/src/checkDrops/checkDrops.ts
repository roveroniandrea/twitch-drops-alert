import axios from 'axios';
import { setTwitchAccessToken, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from '../config';
import { getGames } from './getGames';
import { getStreamsWithDropsByGame } from './getStreamsWithDropsByGame';
import { getUsersByGame } from './getUsersByGame';
import { sendEmail } from './sendEmail';

export const checkDrops = async function () {
	const games = await getGames();

	const access_token: string = await axios
		.post(`https://id.twitch.tv/oauth2/token`, null, {
			params: {
				client_id: TWITCH_CLIENT_ID,
				client_secret: TWITCH_CLIENT_SECRET,
				grant_type: 'client_credentials',
			},
		})
		.catch((err) => console.log(err))
		.then((res) => {
			if (res) {
				return res.data.access_token;
			} else {
				return null;
			}
		});

	setTwitchAccessToken(access_token);

	for (let game of games) {
		const streams = await getStreamsWithDropsByGame(game);
		console.log(`Streams:`, streams);
		if (streams.length > 0) {
			const subscribedUsers = await getUsersByGame(game);
			for (let user of subscribedUsers) {
				sendEmail(game, user, streams);
			}
		}
	}
};
