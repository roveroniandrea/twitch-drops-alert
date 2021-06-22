import { firestore } from '../../config';
import { Game } from '../../types/game';

/**Returns all the games in the firestore collection */
const getGames = async function () {
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

/** Returns the sliced games in the collection and sets the offset */
export const getSlicedGames = async () => {
	const games = await getGames();
	const paginationDoc = firestore.collection('infos').doc('pagination');
	const [offset, length] = await paginationDoc.get().then<[number, number]>((res) => {
		const data = res.data();
		return [data?.offset, data?.length];
	});

	const slicedGames = games.slice(offset, offset + length);
	let newOffset = (offset + length) % games.length;

	if (offset + length > games.length) {
		//Warp circular
		newOffset = Math.min(newOffset, offset);
		slicedGames.push(...games.slice(0, newOffset));
	}

	paginationDoc.update({
		offset: newOffset,
	});

	return slicedGames;
};
