import { firestore } from '../../config';
import { Game } from '../../types/game';
import { User } from '../../types/user';

/**Returns all the users listening for drops of a specific game */
export const getUsersByGame = async function (game: Game) {
	const users = await firestore.collection('users').where('games', 'array-contains', game.id).get();
	return users.docs.map((user) => user.data() as User);
};
