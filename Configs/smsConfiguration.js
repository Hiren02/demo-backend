const twilio = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = class MessageService {
	async sendSms(receiverNumber, message) {
		try {
			await twilio.messages.create({
				from: process.env.TWILIO_NUMBER,
				to: receiverNumber,
				body: message,
			});
		} catch (err) {
			console.log(err);
		}
	}
};
