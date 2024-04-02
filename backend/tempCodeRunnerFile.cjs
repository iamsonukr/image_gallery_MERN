const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

// Instances
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURL = "mongodb+srv://victoriastark357:XIY1PigqTy30OKsb@cluster0.rkkynim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => console.log("Not connected"));

// Setting Schema
const Schema = mongoose.Schema;
const imageSchema = new Schema({ image: String });
const ImageDetails = mongoose.model("imageDetails", imageSchema);
// const imageDetails=require('./imageDetails.cjs')

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../src/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null,  uniqueSuffix  + '-' +  file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
app.get("/", async (req, res) => {
  res.send("Success!!!!");
});


app.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const image = new imageDetails({
    image: req.file.path // Set the image path to the uploaded file's path
  });
  try {
    await image.save();
    res.send("Uploaded !!!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/get-image',(req,res)=>{
  const images=new imageDetails;
  try{
    images.find({}).then((data)=>{
      res.send({status:"OK",data:data})
    })
  }catch(error){
    res.json({status:error})
  }
})



app.listen(5000, () => {
  console.log("Server Started");
});