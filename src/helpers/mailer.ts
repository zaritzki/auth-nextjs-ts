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
			port: Number(process.env.MAILER_PORT) || 0,
			auth: {
				user: process.env.MAILER_USER,
				pass: process.env.MAILER_PASSWORD,
			}
		});

		let emailSubject = "";
		let htmlBody = "";
		switch(emailType) {
			case 'VERIFY':
				emailSubject = "Verify your email";
				htmlBody = `
					<p>Click <a href="${process.env.DOMAIN_URL}/VERIFY?token=${hashedToken}">here</a> to Verify your email or copy and paste the link below:</p>
					<p>${process.env.DOMAIN_URL}/VERIFY?token=${hashedToken}</p>
				`;
				break;
			case 'RESET':
				emailSubject = "Reset your password";
				htmlBody = `
					<p>Click <a href="${process.env.DOMAIN_URL}/resetpassword?token=${hashedToken}">here</a> to Reset your password or copy and paste the link below:</p>
					<p>${process.env.DOMAIN_URL}/resetpassword?token=${hashedToken}</p>
				`;
				break;
			case 'CHANGE':
				emailSubject = "Password Changed";
				htmlBody = `
					<p>Your accound has been changed!</p>
					<p>Click <a href="${process.env.DOMAIN_URL}/login">here</a> to login.</p>
				`;
				break;
			default:
			  	// code block
		}

		// setup the email options
		const mailOptions = {
			from: 'dotzar@gmail.com',
			to: email,
			subject: emailSubject,
			html: htmlBody,
		}

		// send the email
		await transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
			   return console.log(error.message);
			}
			return console.log('Message sent: %s', info.messageId);
		});

	} catch (err:any) {
		throw new Error(err.message)
	}
}