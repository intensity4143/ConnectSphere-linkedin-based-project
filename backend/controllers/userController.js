const User = require("../model/UserModel");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = "24h";

const createToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
};

//-------------- SIGNUP FUNCTION ------------------------
exports.signUp = async (req, res) => {
  try {
    // console.log("req body :-", req.body);
    const { name, email, password } = req.body;

    // check if anyone is empty
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // if email pattern is invalid
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    // checking password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "password must be atleast 8 characters long",
      });
    }
    // checking for existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // create token
    const token = createToken(newUser._id);

    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(501).json({
      success: false,
      message: "internal server error",
    });
  }
};

// ------------------ LOGIN Function --------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking if email or password is empty
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    // finding user
    const userExist = await User.findOne({ email });

    // user not exist
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found !",
      });
    }

    // matching password
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password !",
      });
    }

    const token = createToken(userExist._id); // creating token

    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error !",
    });
  }
};

//---------------- GET CURRENT USER -------------
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // finding user by id and extracting "name" and "email"
    const user = await User.findById(userId).select("name email");

    // when user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found !",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: " Interval server error !",
    });
  }
};

//--------------- GET USER BY ID ----------------
// GET /api/user/users/:id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from the URL

    const user = await User.findById(id).select("name email bio"); // Add more fields if needed

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};


// ------------- UPDATE BIO ------------
exports.updateBio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio } = req.body;  // extract bio from req. body

    // update bio
    const updated = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      updated,
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
