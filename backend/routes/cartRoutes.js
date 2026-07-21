import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();


// =========================
// GET CART
// =========================
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");

    res.json(user.cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});


// =========================
// ADD TO CART
// =========================
router.post("/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        product: req.params.productId,
        quantity: 1,
      });
    }

    await user.save();

    res.json({
      message: "Product added to cart",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});


// =========================
// UPDATE QUANTITY
// =========================
router.put("/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const item = user.cart.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.quantity = req.body.quantity;

    await user.save();

    res.json({
      message: "Cart updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});


// =========================
// REMOVE FROM CART
// =========================
router.delete("/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await user.save();

    res.json({
      message: "Removed from cart",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;