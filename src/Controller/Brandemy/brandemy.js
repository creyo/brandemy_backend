let  BrandeMysupabase = require("../../BrandemySupabase")
let supabase = BrandeMysupabase

const fetchBrandemyData =async (req, res) => {


    try {
       
        let {data,error}= await supabase.from('brands').select("*")

        if(error){
            throw error
        }
          
        return res.status(200).send({status :true , msg : data})
        

    } catch (err) {
        console.log(err)
        return res.status(500).send({status :false , msg : err.message})
    }
}

module.exports = {fetchBrandemyData}