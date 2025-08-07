const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config();

// Route imports
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

// DB connection
const connectDB = require("./config/database");
connectDB();


// Middlewares
app.use(cors());
app.use(express.json());


// API Routes
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);

// Start server
const PORT = process.env.PORT || 5000;

// default route
app.get("/",(req, res) => {
    res.send("this is homepage")
})

app.listen(PORT, ()=>{
    console.log(`server is running at port ${PORT}`)
})