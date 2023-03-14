const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../configs/jwtToken");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefeshToken } = require("../configs/refeshToken");
const jwt = require("jsonwebtoken");
module.exports = {
  //   create a user
  createUser: asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      // create a new user
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      // user already exists
      throw new Error("User already exists");
    }
  }),

  // login
  loginUser: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refeshToken = generateRefeshToken(findUser?.id);
      const updatedUser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refeshToken: refeshToken,
        },
        { new: true }
      );
      res.cookie("refeshToken", refeshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });

      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  }),

  // handle refesh token
  handleRefeshToken: asyncHandler(async (req, res) => {
    const refeshToken = req.cookies.refeshToken;
    if (!refeshToken) throw new Error("No refesh token in cookie");
    const user = await User.findOne({ refeshToken });
    if (!user) throw new Error("No refesh token present in db or not match");
    jwt.verify(refeshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with the token");
      }
      const accessToken = generateToken(user?.id);
      res.json({ accessToken });
    });
  }),

  // logout functionfully
  logout: asyncHandler(async (req, res) => {
    const refeshToken = req.cookies.refeshToken;
    if (!refeshToken) throw new Error("No refesh token in cookie");
    const user = await User.findOne({ refeshToken });
    if (!user) {
      res.clearCookie("refeshToken", {
        httpOnly: true,
        secure: true,
      });
      res.sendStatus(204);
    }

    await User.findOneAndUpdate(refeshToken, { refeshToken: null });
    res.clearCookie("refeshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204);
  }),
  // get list users
  getAllUsers: asyncHandler(async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      throw new Error(error);
    }
  }),

  // get a user
  getAUser: asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);

    try {
      const getAUser = await User.findById(id).select("-password");
      res.json(getAUser);
    } catch (error) {
      throw new Error(error);
    }
  }),

  // update a user
  updateAUser: asyncHandler(async (req, res) => {
    const id = req.user.id;
    validateMongodbId(id);
    try {
      const updateAUser = await User.findByIdAndUpdate(
        { _id: id },
        {
          firstname: req?.body?.firstname,
          lastname: req?.body?.lastname,
          email: req?.body?.email,
          mobile: req?.body?.mobile,
        },
        { new: true }
      );
      res.json(updateAUser);
    } catch (error) {
      throw new Error(error);
    }
  }),

  // delete a user
  deleteAUser: asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const deleteAUser = await User.deleteOne({ _id: id });
      res.json(deleteAUser);
    } catch (error) {
      throw new Error(error);
    }
  }),

  // block a user
  blockUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const blockUser = await User.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true }
      );
      res.json({ message: "User blocked successfully", blockUser: blockUser });
    } catch (error) {
      throw new Error(error);
    }
  }),
  unBlockUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const unBlockUser = await User.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true }
      );
      res.json({
        message: "User unblocked successfully",
        unBlockUser: unBlockUser,
      });
    } catch (error) {
      throw new Error(error);
    }
  }),
};
