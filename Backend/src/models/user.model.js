import mongoose from "mongoose";

const Userschema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  role: {
    type: String,
    enum: ["buyer", "seller"],
    default: "buyer",
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
});

const Usermodel = mongoose.model("user", Userschema);

export default Usermodel;
