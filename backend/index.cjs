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
// const mongoURL = "mongodb+srv://victoriastark357:XIY1PigqTy30OKsb@cluster0.rkkynim.mongodb.net/";
mongoose.connect(mongoURL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => console.log("Not connected"));

// Setting Schema
const Schema = mongoose.Schema; 
const imageSchema = new Schema({ image: String });
const imageDetails = mongoose.model("imageDetails", imageSchema);
// const imageDetails=require('./imageDetails.cjs')

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../VITE PROJECTS/imggal/public/images');
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
    image: req.file.filename // Set the image path to the uploaded file's path
  });
  try {
    await image.save();
    res.send("Uploaded !!!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/get-image', async (req, res) => {
  try {
    // console.log("Getting images");
    const images = await imageDetails.find({});
    res.status(200).json({ status: "OK", data: images });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch images" });
  }
});



app.delete('/delete-img/:id', async (req, res) => {
  try {
    const id = req.params.id; // Get the image ID from the URL parameter

    // Find the image by ID and delete it
    const img = await imageDetails.findByIdAndDelete(id);

    // If the image is not found
    if (!img) {
      return res.status(404).json({ message: "Image not found" });
    }

    // If the image is found and deleted successfully
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Failed to delete image. Please try again later." });
  }
});




app.listen(5000, () => {
  console.log("Server Started");
});