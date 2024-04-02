const nodemailer = require('nodemailer');


// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rajputpawan824@gmail.com', // Sender's Gmail email address
        pass: 'njzmsjlsjdlqrqbq' // Sender's Gmail app password
    }
});





// Email for new user and resetpassword 
async function sendEmail(user_name, recipientEmail, resetToken, useFor) {
    return new Promise((resolve, reject) => {
        // Define email options


        let mailOptions

        // for email verification
        if (useFor === "emailVerification") {
            mailOptions = {
                from: "noreply@gmail.com", // Sender address
                to: recipientEmail, // Recipient address
                subject: "Welcome to Brandemy! Verify Your Email", // Subject line
                html: `
                <p style="font-family: Arial, sans-serif;">Dear ${user_name},</p>
                <p style="font-family: Arial, sans-serif;">Welcome to Brandemy! Please verify your email address to activate your account.</p>
                <p style="font-family: Arial, sans-serif;">To verify your email, please click on the following link:</p>
                <p><a href="https://www.brandemy.com/register/verify-email?token=${resetToken}" style="font-family: Arial, sans-serif; color: #007bff; text-decoration: none;">Verify Email</a></p>
                <p style="font-family: Arial, sans-serif;">This link will expire in 10 minutes for security reasons.</p>
                <p style="font-family: Arial, sans-serif;">If you did not sign up for Brandemy, you can safely ignore this email.</p>
                <p style="font-family: Arial, sans-serif;">Thank you,</p>
                <p style="font-family: Arial, sans-serif;">Brandemy</p>
                ` // HTML body
            };

        }


        // for resetPassword
        if (useFor === "resetPassword") {
            mailOptions = {
                from: "noreply@gmail.com", // Sender address
                to: recipientEmail, // Recipient address
                subject: "Brandemy Application Password Reset Request", // Subject line
                html: `
                    <p><strong>Dear ${user_name},</strong></p>
                    <p>We received a request to reset your password. If you did not make this request, you can ignore this email.</p>
                    <p>To reset your password, please click on the following link:</p>
                    <p><a href="https://www.brandemy.com/login/reset-password?token=${resetToken}">Reset Password</a></p>
                    <p>Please note that this link is valid for 10 minutes, after which you'll need to request a new password reset.</p>
                    <p><strong>Thank you,</strong></p>
                    <p><strong>Brandemy</strong></p>
                ` // HTML body
            };
        }





        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error); // Reject the promise with the error
            } else {
                resolve(info); // Resolve the promise with the info object
            }
        });
    });
}



//for send voting link to multiple friend 
async function sendEmailToMultiple(askingForVote_id,askingForVote, recipientEmails) {
    return new Promise(async (resolve, reject) => {
        try {


            // Loop through each recipient and send email
            for (let i = 0; i < recipientEmails.length; i++) {
                // Email options
                let mailOptions = {
                    from: 'noreply@gmail.com', // Sender address
                    to: recipientEmails[i], // Recipient address
                    subject: 'Vote Request', // Subject line
                    html: `
                    <p>Dear There 👋,</p>
                    <p>Your opinion matters!</p>
                    <p>Your friend <strong>${askingForVote}</strong> wants your suggestion on brands. Please help him/her by voting for a good brand and leaving your comments as well.</p>
                    <p>To vote, click on the link below:</p>
                    <p><a href="https://www.brandemy.com/brandemyvoting?email=${recipientEmails[i]}" style="font-family: Arial, sans-serif; color: #007bff; text-decoration: none;">vote now</a></p>
                    <p>Thank you for your time and support!</p>
                    <p>Brandemy Team</p>
                    
                    `  // Email body
                };

                // Send email
                let info = await transporter.sendMail(mailOptions);
               // console.log(`Email sent to ${recipientEmails[i]}: ${info.response}`);
            }

            resolve("All emails sent successfully.");
        } catch (error) {
            reject(error);
        }
    });
}

//function to use
// sendEmailToMultiple(askingForVote_id,askingForVote, recipientEmails)
//     .then(result => {
//         console.log(result);
//     })
//     .catch(error => {
//         console.error('Error occurred:', error);
//     });





//for send email to thank for voting
async function thanksForVoting(user_name, recipientEmail) {
    try {
        // Define email options
        let mailOptions = {
            from: "noreply@gmail.com", // Sender address
            to: recipientEmail, // Recipient address
            subject: "Thank You for Sharing Your Opinion!", // Subject line
            html: `
            <p style="font-family: Arial, sans-serif;">Dear ${user_name},</p>
            <p style="font-family: Arial, sans-serif;">Thank you for taking the time to share your opinion on Brandemy!</p>
            <p style="font-family: Arial, sans-serif;">While your vote might not directly impact Brandemy, it means a lot to your friend who values your perspective.</p>
            <p style="font-family: Arial, sans-serif;">Your willingness to contribute to their decision-making process speaks volumes about your friendship.</p>
            <p style="font-family: Arial, sans-serif;">Thank you for being a supportive friend!</p>
            <p style="font-family: Arial, sans-serif;">Best regards,</p>
            <p style="font-family: Arial, sans-serif;">Brandemy</p>
            <br>
            <p style="font-family: Arial, sans-serif;">Being a part of Brandemy, click the link below to login:</p>
            <a href="https://www.brandemy.com/login" style="font-family: Arial, sans-serif; color: #007bff; text-decoration: none;">Login to Brandemy</a>
            ` // HTML body
        };

        // Send email and await the result
        const info = await transporter.sendMail(mailOptions);

        // Resolve the promise with the info object
        return info;
    } catch (error) {
        // Reject the promise with the error
        throw error;
    }
}



module.exports = { sendEmail, thanksForVoting,sendEmailToMultiple }