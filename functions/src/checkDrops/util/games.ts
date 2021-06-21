import { firestore } from '../../config';
import { Game } from '../../types/game';

/**Returns all the games in the firestore collection */
export const getGames = async function () {
	const coll = await firestore.collection('games').get();
	return coll.docs.map<Game>((doc) => {
		const data = doc.data();
		return {
			name: data.name,
			id: doc.id,
			dropsOnPreviousCheck: data.dropsOnPreviousCheck,
		};
	});
};

export const setGameHasDrops = async function (gameId: string, hasDrops: boolean) {
	return firestore.collection('games').doc(gameId).update({
		dropsOnPreviousCheck: hasDrops,
	});
};
