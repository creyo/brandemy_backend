const jwt = require("jsonwebtoken")
const initializeSupabase = require('../supabaseConfig');
const supabase = initializeSupabase();


// this file has wisul data

function generateToken(payload, secretKey) {
    let token = jwt.sign(payload, secretKey);
    return token;
}

const secretKey = 'osnilWebSolution';




const storeNewTokenInDB = async (req, res) => {
    try {

        const publicationID = req.decoded.publication_id
        let payload = req.decoded
        delete payload.iat
        let newToken = generateToken(payload, secretKey)


        const { data, error } = await supabase
            .from('publication')
            .update({ "token": `${newToken}` })
            .eq('publication_id', `${publicationID}`)
            .select();

        if (error) {
            res.status(401).send({ error: error.message })
        } else {
            res.status(201).send({ status: true, msg: "Token Updated Successfully" })
        }


    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


async function generateUserToken(req, res) {
    try {
        // Validate input parameters
        let { user_name, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: false, message: "Both email and password are required." });
        }

        // Check if the user_name is provided
        if (!user_name) {
            // Check if the email already exists
            const { data: existingUser, error: existingUserError } = await supabase.from('user').select('email').eq('email', email).single();
            if (existingUserError) {
                throw existingUserError;
            }
            if (existingUser) {
                return res.status(400).json({ status: false, message: "Email already exists." });
            }
        } else {
            // Store incoming data in Supabase database table 'user'
            const { data, error } = await supabase.from('user').insert([{ user_name, email, password }]);
            if (error) {
                throw error;
            }
        }

        // Create payload for the token
        const payload = {

            email,
            password
        };

        // Generate JWT token with payload and secret key
        const token = jwt.sign(payload, secretKey);
        return res.status(200).json({ status: true, token: token });
    
    } catch (error) {
        console.error('Error generating token and storing data:', error);
        return res.status(500).json({ status: false, message: "An error occurred while processing your request." });
    }
}







module.exports = { storeNewTokenInDB, generateUserToken }

