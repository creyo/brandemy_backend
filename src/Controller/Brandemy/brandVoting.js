const BrandeMysupabase = require("../../BrandemySupabase");
const supabase = BrandeMysupabase
let secretKey = "osnilWebSolutionPvtLtd."
let { fetchUserWithFavorites } = require("../Brandemy/fetchUserWithfav/fetchUserWithFav")
const { thanksForVoting } = require("../../function/nodemailer")



const sendEmailToMultipleForVoting = async (req, res) => {
    try {
        let { user_id } = req.param.user_id
        let { emails, userName } = req.body

        let status
        let err
        sendEmailToMultiple(user_id, userName, emails)
            .then(result => {
                status = true
                console.log(result);
            })
            .catch(error => {
                status = false
                err = error
                console.error('Error occurred:', error);
            });

        if (status === true) {
            return res.status(200).send({ status: true, msg: "email sent succesfully" })
        } else {
            return res.status(501).send({ status: true, msg: "there is problem to send Emails", error: err })

        }

    } catch (error) {
        return res.status(500).send({ status: false, msg: error })
    }
}


const votingPageDetails = async (req, res) => {

    try {
        let { user_id } = req.params


        const { data: user, error: userError } = await supabase
            .from('user')
            .select('*')
            .eq('id', user_id)
            .single();
        if (userError) {
            throw userError.message;
        }

        // Fetch favorite brands for the user
        const { data: favorites, error: favoritesError } = await supabase
            .from('favorites')
            .select('brands(*)')
            .eq('user_id', user_id);

        if (favoritesError) {
            throw favoritesError.message;
        }

        let data = { ...user, favorites }



        // Return user with merged data
        return res.status(200).send({ status: true, msg: data })



    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: "error" })

    }
}

const voting = async (req, res) => {
    try {

        let { user_id, voter_name, voter_email, comment, brand_id } = req.body

        if (!user_id || !comment || !brand_id || !voter_email || !voter_name) {
            return res.status(400).send({ status: false, msg: "All fields are require" })
        }

        let voter_id

        //first we have to check in db voter exist in user table or not ? is not then update in database, if not then get highest_id and set in favorites table
        console.log(voter_email)
        if (voter_email) {
            const { data, error } = await supabase.from('user').select("*").eq("email", voter_email)
            if (error) {
                console.log(error)
                return res.status(501).send({ status: false, msg: "database error" })
            }

            if (data.length > 0) {
                console.log(data)
                voter_id = data[0].id

            } else {
                const { data, error } = await supabase.from('user').upsert([{ name: voter_name, email: voter_email }])

                if (error) {
                    console.log(error.message)
                    return res.status(501).send({ status: false, msg: "database error" })

                } else {
                    const { data, error } = await supabase.from('user').select("*").eq("email", voter_email).single()

                    if (error) {
                        return res.status(501).send({ status: false, msg: "database error" })

                    } else {
                        voter_id = data.id
                    }
                }

            }
        }

        //console.log("voter_id",voter_id)
        // using voter_name and voter_email

        //Verify whether the voter has already cast their vote 
        //console.log(user_id,brand_id,voter_id)
        let { data, error } = await supabase
            .from('voters')
            .select("*").eq("user_id", user_id).eq("voter_id", voter_id).eq("brand_id", brand_id)


        if (error) {
            return res.status(501).send({ status: false, msg: "database error" })
        }
        if (data.length > 0) {
            return res.status(400).send({ status: false, msg: "you can't vote again on same Product" })
        } else {

            let voting_data = {
                voter_id: voter_id,
                user_id,
                comment,
                brand_id
            }
            let { data, error } = await supabase.from('voters').upsert([voting_data])


            // console.log("data2",data)

            if (error) {
                return res.status(501).send({ status: false, msg: "database error" })

            } else {
                // console.log(voter_name,voter_email)
                thanksForVoting(voter_name, voter_email)
                    .then(result => {
                        console.log(result);
                    })
                    .catch(error => {
                        console.error('Error occurred:', error);
                    });

                return res.status(200).send({ status: true, msg: "thank you for voting " })
            }

        }

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: "server error" })

    }
}





module.exports = { voting, sendEmailToMultipleForVoting, votingPageDetails }