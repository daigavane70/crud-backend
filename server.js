const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");

//middleware
app.use(express.json());
app.use(cors());

//connect to database
connectDB();

//routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

//routes
app.use("/api/user", userRoutes);

//listen to PORT
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
