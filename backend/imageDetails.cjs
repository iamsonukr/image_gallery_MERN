const mongoose=require('mongoose')


const imageSchema = new mongoose.Schema(
    {
        image: String
    }
);
const imageDetails=mongoose.model("imageDetails",imageSchema)
module.exports = imageDetails;