import axios from 'axios';
import { TWITCH_ACCESS_TOKEN, TWITCH_CLIENT_ID } from '../config';
import { Game } from '../types/game';

const dropTagId = 'c2542d6d-cd10-4532-919b-3d19f30a768b';

export const getStreamsWithDropsByGame = async function (game: Game) {
	const streams: any[] = await axios
		.get(`https://api.twitch.tv/helix/streams`, {
			headers: {
				Authorization: `Bearer ${TWITCH_ACCESS_TOKEN}`,
				'client-id': TWITCH_CLIENT_ID,
			},
			params: {
				game_id: game.id,
			},
		})
		.then((res) => res.data?.data);

	return streams?.filter((stream: any) => stream.tag_ids.includes(dropTagId)).map<string>((stream) => stream.user_login) || [];
};
