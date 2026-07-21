import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
  description: {
  type: String,
  required: true,
},
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
  type: String,
  enum: ["Available", "Sold"],
  default: "Available",
},
  
});

export default mongoose.model("Product", productSchema);