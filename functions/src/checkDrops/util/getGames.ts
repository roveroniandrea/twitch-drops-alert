import { firestore } from '../../config';
import { Game } from '../../types/game';

/**Returns all the games in the firestore collection */
export const getGames = async function () {
	const coll = await firestore.collection('games').get();
	return coll.docs.map<Game>((doc) => ({
		name: doc.data().name,
		id: doc.id,
	}));
};
