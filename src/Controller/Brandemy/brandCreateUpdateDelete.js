const BrandemySupabase = require("../../BrandemySupabase")
const supabase = BrandemySupabase


const createBrand = async (req, res) => {
    try {

        let { brand_name, logo, domain_name, price, description } = req.body

        if (!brand_name || !logo || !domain_name || !price || !description) {
            return res.status(400).send({ status: false, msg: "all fields are required" })
        }

        const { data, error } = await supabase.from("brands").insert([req.body])
        if (error) {
            return res.status(400).send({ status: false, msg: error.message })
        } else {
            return res.status(200).send({ status: true, msg: "Data created sucessfully" })
        }

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const updateBrand = async (req, res) => {
    try {
        let brand_id = req.params.id
        let { brand_name, logo, domain_name, price, description } = req.body

        let dataToUpdate = {
            brand_name,
            logo,
            domain_name,
            price,
            description
        }

        let { data, error } = await supabase.from("brands").update(dataToUpdate).eq("id", `${brand_id}`)

        if (error) {
            return res.status(400).send({ status: false, msg: error.message })
        } else {
            return res.status(200).send({ status: true, msg: "data updated successfully" })
        }



    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const deleteBrand = async (req, res) => {
    try {
        let brand_id = req.params.id


        const { data,error } = await supabase
            .from('brands')
            .delete()
            .eq('id', `${brand_id}`)

            if(error){
                return res.status(400).send({ status: false, msg: error.message })
            }else{
                return res.status(200).send({ status: false, msg: "brand deleted successfully" })
            }


    } catch (error) {
        return res.status(500).send({ status: true, msg: error.message })
    }
}



module.exports = { createBrand, updateBrand, deleteBrand }