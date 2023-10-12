import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }:any) => {
	try {
		// create a hashed token
		const hashedToken = await bcryptjs.hash(userId.toString(), 10);

		// find the user
		if (emailType === "VERIFY") {
			await User.findByIdAndUpdate(userId, {
				verifyToken: hashedToken,
				verifyTokenExpiry: Date.now() + 3600000
			})
		} else if (emailType === "RESET") {
			await User.findByIdAndUpdate(userId, {
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiry: Date.now() + 3600000
			})
		}

		// build the transforter
		var transporter = nodemailer.createTransport({
			host: process.env.MAILER_HOST_URL,
			port: process.env.MAILER_PORT,
			auth: {
				user: process.env.MAILER_USER,
				pass: process.env.MAILER_PASSWORD,
			}
		});

		// setup the email options
		const mailOptions = {
			from: 'dotzar@gmail.com',
			to: email,
			subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
			html: `
				<p>Click <a href="${process.env.DOMAIN_URL}/verify?token=${hashedToken}">here</a> to ${emailType === 'VERIFY' ? "Verify your email" : "Reset your password"} or copy and paste the link below:</p>
				<p>${process.env.DOMAIN_URL}/verify?token=${hashedToken}</p>
			`
		}

		// send the email
		const mailRes = await transporter.sendMail(mailOptions);

		return mailRes;

	} catch (err:any) {
		throw new Error(err.message)
	}
}