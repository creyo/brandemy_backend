const initializeSupabase = require('../supabaseConfig'); // Update the path if needed
const jwt = require("jsonwebtoken")
const secretKey = 'osnilWebSolution';

// Initialize Supabase connection
const supabase = initializeSupabase();

const getWisulData = async (req, res) => {
    try {
        // Replace 'YOUR_TABLE_NAME' with the name of your table
        const publicationID = req.decoded.publication_id
        const userTokenIat = req.decoded.iat
     
        console.log(publicationID)



        let { data, error } = await supabase
            .from('articles')
            .select(`
    *,
    articlestatus(*),
    authors(*),
    categories(*),
    post_type(*), 
    publication(*),
     control(*)
    `).eq("publication_id", `${publicationID}`).eq("status", "3");
        // '*' fetches all columns, you can specify specific columns if needed

        if (error) {
            throw error;
        }else{  
                      
           let dbToken =  data[0].publication.token
           if(!dbToken){
            return res.status(404).json({ status: false, message: "check supabase config", error: err.message });

           }
           
           jwt.verify(dbToken,secretKey,(err, decoded) => {
            if (err) {
               return res.status(500).json({ status: false, message: "internal token error", error: err.message });
            }
            let dbTokenIat = decoded.iat
            
            if(dbTokenIat > userTokenIat ){
                return res.status(401).json({ status: false, message: "session expired"});
            }else{
                res.json({ data })
            }
        })
        }

      //  res.json({ data }); // Send the fetched data as a JSON response
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getWisulData }