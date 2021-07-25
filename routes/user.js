const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const { check, validationResult } = require("express-validator");
const router = express.Router();

//@Route :  GET /api/user
//@access:  public
//@desc  :  Get all users in the database
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res
        .status(400)
        .json({ msg: "No User is present in the database" });
    }

    return res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
//@Route :  GET /api/user/:id
//@access:  public
//@desc  :  Get  user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "User do not exists" }] });
    }
    return res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//@Route :  POST /api/user
//@access:  public
//@desc  :  Create new user in the database
router.post(
  "/",
  check("name", "name is required").not().isEmpty(),
  check("email", "email is required").not().isEmpty(),
  check("password", "password is required").isLength({
    min: 6,
  }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, email, password, number } = req.body;
      let user = await User.findOne({ email });

      //check if user already exits in the database.
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //create new user
      user = new User({
        name,
        email,
        password,
        number,
      });

      //hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save user
      await user.save();

      return res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

//@Route :  PUT /api/user/:id
//@access:  public
//@desc  :  Update user in the database

router.put("/:id", async (req, res) => {
  try {
    const { name, email, number } = req.body;
    let user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: { name, email, number },
      },
      { new: true }
    );

    //check if user already exits in the database.
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "User do not exists" }] });
    }
    //save user
    await user.save();

    return res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//@Route :  DELETE /api/user/:id
//@access:  public
//@desc  :  Delete user in the database
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "User do not exists" }] });
    }

    return res.json({ msg: `User with ID:  ${user._id} is deleted` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
