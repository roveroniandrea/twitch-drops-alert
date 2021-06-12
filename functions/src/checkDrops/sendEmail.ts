import { Game } from '../types/game';
import { User } from '../types/user';
import nodemailer = require('nodemailer');
import { EMAIL_PASSWORD, EMAIL_USER } from '../config';
import Mail = require('nodemailer/lib/mailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASSWORD,
	},
});

export const sendEmail = function (game: Game, user: User, streams: string[]) {
	console.log(`Spedisco mail a ${user.email}`);
	const mailOptions: Mail.Options = {
		from: `Twitch drops alert <${EMAIL_USER}>`,
		to: user.email,
		subject: `${game.name} ha stream con drop!`,
		html: `
        <h2>Ciao ${user.name}!</h2>
        <p>Ci sono stream attivi con drop per ${game.name}!</p>

        <p>Ad esempio:</p>
        <ul>
        ${streams.map((str) => `<li>https://www.twitch.tv/${str}</li>`)}
        </ul> `,
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log('Error sendEmail', err);
		} else {
			console.log('Info', info);
		}
	});
};
