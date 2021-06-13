import admin = require('firebase-admin');
import functions = require('firebase-functions');
import dotenv = require('dotenv');

const functionsConfig = functions.config();

if (!functionsConfig.twitchAPI) {
	dotenv.config();
}

const twitchAPI = functionsConfig.twitchAPI || process.env;
const emailAPI = functionsConfig.emailAPI || process.env;

export const TWITCH_CLIENT_SECRET = twitchAPI.TWITCH_CLIENT_SECRET;
export const TWITCH_CLIENT_ID = twitchAPI.TWITCH_CLIENT_ID;
export let TWITCH_ACCESS_TOKEN = '';

/**Sets the twitch access token, retrieved when authenticating */
export const setTwitchAccessToken = function (token: string) {
	TWITCH_ACCESS_TOKEN = token;
};

//Initializez the firebase app with cloud environment or local (for testing)
if (functions.config().firebase) {
	admin.initializeApp();
} else {
	let serviceAccount = require('../twitch-drops-alert-firebase-adminsdk-ipydo-fa15e7b9f6.json');

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

export const initializedAdmin = admin;

export const firestore = admin.firestore();

export const EMAIL_USER = emailAPI.EMAIL_USER;
export const EMAIL_PASSWORD = emailAPI.EMAIL_PASSWORD;
