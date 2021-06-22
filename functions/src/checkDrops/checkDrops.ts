import axios from 'axios';
import { setTwitchAccessToken, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from '../config';
import { getSlicedGames, setGameHasDrops } from './util/games';
import { getStreamsWithDropsByGame } from './util/getStreamsWithDropsByGame';
import { getUsersByGame } from './util/getUsersByGame';
import { sendEmail } from './util/sendEmail';
import functions = require('firebase-functions');

/**For each game, finds streams with drops and notifies the users with an email */
export const checkDrops = async function () {
	const games = await getSlicedGames();

	const access_token: string = await axios
		.post(`https://id.twitch.tv/oauth2/token`, null, {
			params: {
				client_id: TWITCH_CLIENT_ID,
				client_secret: TWITCH_CLIENT_SECRET,
				grant_type: 'client_credentials',
			},
		})
		.catch((err) => console.error(`Error retrieving token: `, err))
		.then((res) => {
			if (res) {
				return res.data.access_token;
			} else {
				console.error(`Response from token is null`);
				return null;
			}
		});

	if (access_token) {
		setTwitchAccessToken(access_token);

		for (let game of games) {
			try {
				const streams = await getStreamsWithDropsByGame(game);
				const gameHasDrops = streams.length > 0;
				if (gameHasDrops && !game.dropsOnPreviousCheck) {
					const subscribedUsers = await getUsersByGame(game);
					for (let user of subscribedUsers) {
						try {
							sendEmail(game, user, streams);
						} catch (err) {
							console.log(`Error sending email at ${user.email} for game ${game.id}: `, err);
						}
					}
				}
				if (game.dropsOnPreviousCheck !== gameHasDrops) {
					// No need to wait
					setGameHasDrops(game.id, gameHasDrops);
				}
			} catch (err) {
				console.log(`Error on game ${game.id}: `, err);
			}
		}
	}
};

/**See  `checkDrops` for info*/
export const CF_checkDrops = functions.pubsub.schedule('every 60 minutes').onRun(checkDrops);
