const BrandeMysupabase = require("../../BrandemySupabase")

const jwt = require("jsonwebtoken");
const { generateToken } = require("../../function/generateToken");
const { sendEmail } = require("../../function/nodemailer");
let secretKey = "osnilWebSolutionPvtLtd."
const { fetchUserWithFavorites } = require("../Brandemy/fetchUserWithfav/fetchUserWithFav")

const supabase = BrandeMysupabase



const brandemyLogin = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ status: false, msg: "email and password required" })
        }


        const { data, error } = await supabase
            .from("user")
            .select("*").eq("email", `${email}`).eq("password", `${password}`).single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        let userdata = await fetchUserWithFavorites(email)


        // If insertion is successful, return the inserted data
        if (data) {

            let token = jwt.sign({ data }, "osnilwebsolution")
            return res.status(201).send({ status: true, token: token, user: userdata });

        } else {
            return res.status(404).json({ error: "user not found" });
        }

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}




const forgetPassword = async (req, res) => {
    try {
        let { email } = req.body

        if (!email) {
            return res.status(400).send({ status: false, msg: "Please enter your email id" })
        }

        const { data, error } = await supabase
            .from("user")
            .select("*").eq("email", `${email}`).single()



        if (!data) {
            return res.status(404).send({ status: false, msg: "Email does not exist" })
        }
        if (error) {
            throw error.message
        }

        // this is pre-built generateToken (function folder) which takes only one parameter "payload"
        let resetToken = generateToken({ data })
        let { name } = data
        //send mail of reset token and this takes three parameter (user_name, recipientEmail, resetToken) 
        sendEmail(name, email, resetToken, "resetPassword")
            .then(info => {
                return res.status(200).send({ status: true, msg: "Token sent to your mail id" })
            })
            .catch(error => {
                return res.status(502).send({ status: false, msg: " unable to send mail ,try later", error })

            });


    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: "server error" })
    }
}


const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { password } = req.body;



        if (password === undefined || password.length === 0) {
            return res.status(400).json({ message: "Password is required" });
        }


        let Decoded

        // Verify JWT token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.log(err.name)
                if (err.name === 'TokenExpiredError') {
                    return res.status(200).json({ msg: err.name });
                } else if (err.name === 'JsonWebTokenError') {
                    return res.status(200).json({ msg: err.name });
                } else {
                    return res.status(200).json({ msg: err.message });
                }
            } else {
                Decoded = decoded
            }
        });

        let Email = Decoded.data.email



        // Example code for updating password in the database
        const { data, error } = await supabase
            .from('user')
            .update({ password: password })
            .eq('email', Email)
            .select();

        let payload = data[0]
        console.log(payload)
        // this token will store in session that will never expire untill user logout
        let newtoken = jwt.sign(payload, secretKey)

        if (error) {
            throw error;
        }

        return res.status(200).json({ status: true, message: 'Password reset successful.', token: newtoken });

    } catch (err) {
        console.error('Error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};


const signupWithGoogle = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;


        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: false, msg: "Token must be provided" });
        }
        const token = authHeader.split(" ")[1];
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT token');
        }

        // Decode the payload part
        const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));

        let decodeToken = JSON.parse(payload)


        let name = decodeToken.user_metadata.full_name
        let avatar = decodeToken.user_metadata.avatar_url
        let email = decodeToken.user_metadata.email
        let user_data = { name, avatar, email , verified: "True" }




        //checking user already present in database or not |
        if (email) {
            let { data, error } = await supabase
                .from('user')
                .select('*').eq("email", email)

            if (error) {
                throw error.message
            }
            
            if (data.length > 0) {
                let user_token = jwt.sign(user_data, secretKey)
                let userDetail = await fetchUserWithFavorites(email)
                return res.status(200).send({ status: true, token: user_token, user: userDetail })
            }
        }



        const { data, error } = await supabase
            .from('user')
            .upsert([user_data])
            .select()


        if (error) {
            return res.status(501).send({ status: false, msg:"database error (signupWithGoogle)" })

        } else {
            let user_token = jwt.sign(user_data, secretKey)
            let userDetail = await fetchUserWithFavorites(email)
            return res.status(200).send({ status: true, token: user_token, user: userDetail })
        }


    } catch (err) {
       
        return res.status(500).send({ status: false, msg: "server error" })

    }
}




module.exports = { brandemyLogin, forgetPassword, resetPassword, signupWithGoogle }  