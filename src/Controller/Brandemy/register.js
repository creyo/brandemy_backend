const BrandeMysupabase = require("../../BrandemySupabase");
const { generateToken } = require("../../function/generateToken");
const { sendEmail } = require('../../function/nodemailer')
const jwt = require("jsonwebtoken")
let secretKey = "osnilWebSolutionPvtLtd."

const supabase = BrandeMysupabase;
// Initialize Google OAuth client

const brandemyregister = async (req, res) => {
    try {
        let { name, email, password } = req.body
        // Insert the user data into the 'users' table
        if (!name || !email || !password) {
            return res.status(400).send({ status: false, msg: "Name , email , password this fields are required" });
        }

        const type = "user"
        let resetToken = { name, email, password, type }
        // generate token to send with email
        const token = generateToken(resetToken)
        console.log(email)
        const { data: isExist, error } = await supabase
            .from('user')
            .select('*')
            .eq('email', email).single();

        if (error) {
            console.log(error.message)
        }

        if (isExist || isExist.password !== null) {
            return res.status(400).send({ status: false, msg: "email already exist" })
        } else {
            //saving user information in database 
            const { data, error } = await supabase
                .from('user')
                .upsert([resetToken])
                .select();


            if (error) {
                console.error('Error upserting data:', error.message);
            }
        }
        //send mail of reset token and this takes four parameter (user_name, recipientEmail, resetToken, useFor ) 
        sendEmail(name, email, token, "emailVerification")
            .then(info => {
                return res.status(200).send({ status: true, msg: "Token sent to your mail id" })
            })
            .catch(error => {
                console.log(error)
                return res.status(502).send({ status: false, msg: " unable to send mail ,try later", error })
            });


    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ status: false, msg: error });
    }
}











// Email verification 


const verifiedEmail = async (req, res) => {
    try {
        // Extract token from query parameter
        let token = req.query.token;
        console.log(token)

        let Decoded
        // Verify JWT token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.log(err)
                if (err.name === 'TokenExpiredError') {
                    return res.status(400).json({ msg: err.name });
                } else if (err.name === 'JsonWebTokenError') {
                    return res.status(400).json({ msg: err.name });
                } else {
                    return res.status(400).json({ msg: err.message });
                }
            } else {
                Decoded = decoded
            }
        });
        console.log(Decoded)
        let email = Decoded.email

        const { data, error } = await supabase
            .from('user')
            .update({ verified: "True" })
            .eq('email', email);


        if (error) {
            return res.status(400).send({ status: false, msg: error });
        } else {


            const { data, error } = await supabase
                .from("user")
                .select("*").eq("email", `${email}`).single()

            if (error) {
                throw error
            }

            // console.log(data)
            let user_token = jwt.sign(data, secretKey)
            return res.status(200).send({ status: true, msg: "user verified", token: user_token, user: data });

        }

    } catch (err) {
        console.error('Error verifying token:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports = { brandemyregister, verifiedEmail };  