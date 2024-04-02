const express = require("express")
const router = express.Router() 
const {getWisulData}= require('../Controller/fetchFunction')
const {authentication,checkUserInDatabase} = require("../middleware/middleware")
const { storeNewTokenInDB,generateUserToken } = require("../Controller/regenrateToken")
const { fetchBrandemyData } = require("../Controller/Brandemy/brandemy")
const { brandemyLogin,forgetPassword, resetPassword, signupWithGoogle } = require("../Controller/Brandemy/login")
const { brandemyregister, verifiedEmail } = require("../Controller/Brandemy/register")
const { updateBrand, deleteBrand, createBrand } = require("../Controller/Brandemy/brandCreateUpdateDelete")
const {voting,sendEmailToMultipleForVoting, votingPageDetails} = require("../Controller/Brandemy/brandVoting")

router.post("/login",generateUserToken)
router.get("/getWisulData",authentication,getWisulData)

router.get("/resetToken",authentication,storeNewTokenInDB)
router.get("/brandemydata",fetchBrandemyData)

// Brandemy Apis
router.post("/brandemy_login",brandemyLogin)
router.post("/registerbrandemy",brandemyregister)
router.post("/register/verify-email",verifiedEmail)
router.post("/signupwithgoogle",signupWithGoogle)
router.post("/forgetpassword",forgetPassword)
router.post("/login/reset-password",resetPassword)

//Voting For Brandemy
router.get("/votingpagedetails/:user_id",votingPageDetails)
router.post("/api/voting",voting)
router.post("/emailsforvotings/:user_id",sendEmailToMultipleForVoting)


//crud
router.post('/brandemy_register',brandemyregister)
router.post("/create_brand",createBrand) // i have to implement authentication.
router.put("/update_brand/:id",updateBrand) // i have to implement authentication.
router.delete("/delete_brand/:id",deleteBrand) // i have to implement authentication.

  
 


//create token for wisul Data 



module.exports = router 