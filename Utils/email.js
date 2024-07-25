const emailHelper = require("../Configs/Email");

const transporterConfig = {
	service: "gmail",
	port: 587,
	host: "smtp.gmail.com",
	secure: false,
	auth: {
		user: process.env.EMAIL_ID,
		pass: process.env.EMAIL_APP_PASSWORD,
	},
};

module.exports.sendResetPasswordMailHelper = function (receiverMail, otp) {
	try {
		emailHelper.sendMail({
			receiverMail: receiverMail,
			subject: "Password Reset OTP For Your OnePic Account ",
			senderEmail: process.env.EMAIL_ID,
			templateName: "resetPassword.ejs",
			templateReplaceValue: {
				otp: `${otp}`,
				baseUrl: process.env.BASE_URL,
			},
			transporterConfig,
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports.sendPasswordResetMail = function (receiverMail, receiverUserId, token, subject = "Password Reset Link For Your OnePic Account ", template = "resetPassword.ejs", isAdmin = false) {
	try {
		emailHelper.sendMail({
			receiverMail: receiverMail,
			subject: subject,
			senderEmail: process.env.EMAIL_ID,
			templateName: template,
			templateReplaceValue: {
				baseUrl: process.env.BASE_URL,
				resetLink: `${isAdmin ? process.env.FORGOT_PASSWORD_ADMIN_ROUTE : process.env.FORGOT_PASSWORD_ROUTE}?id=${receiverUserId}&token=${token}`,
			},
			transporterConfig,
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports.phoneVerificationOtpSendMail = function (receiverMail, otp) {
	try {
		emailHelper.sendMail({
			receiverMail: receiverMail,
			subject: "Phone verification OTP For Your OnePic Account ",
			senderEmail: process.env.EMAIL_ID,
			templateName: "verificationOTP.ejs",
			templateReplaceValue: {
				otp: `${otp}`,
				baseUrl: process.env.BASE_URL,
			},
			transporterConfig,
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports.adminPasswordSenderMail = function (receiverMail, password) {
	try {
		emailHelper.sendMail({
			receiverMail: receiverMail,
			subject: "Set admin account password for OnePic",
			senderEmail: process.env.EMAIL_ID,
			templateName: "adminPassword.ejs",
			templateReplaceValue: {
				password: `${password}`,
				baseUrl: process.env.BASE_URL,
			},
			transporterConfig,
		});
	} catch (err) {
		console.log(err);
	}
};
