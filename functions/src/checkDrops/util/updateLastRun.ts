import { firestore, initializedAdmin } from '../../config';

export const updateLastRun = async (addMinutes: number) => {
	const FT = initializedAdmin.firestore.Timestamp;
	const now = FT.now();
	firestore
		.collection('infos')
		.doc('lastRun')
		.set({
			timestamp: now,
			nextRun: new FT(now.seconds + addMinutes * 60, now.nanoseconds),
		});
};
