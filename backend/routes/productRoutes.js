import express from "express";
import Product from "../models/Products.js";
import auth from "../middleware/auth.js";

const router = express.Router();


// =====================
// GET ALL PRODUCTS
// =====================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate(
  "owner",
  "name email"
);

    res.json(products);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =====================
// GET SINGLE PRODUCT
// =====================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
  "owner",
  "name email"
);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =====================
// ADD PRODUCT
// =====================
router.post("/", auth, async (req, res) => {
  try {
    const newProduct = new Product({
      title: req.body.title,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      description: req.body.description,

      owner: req.user.id,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =====================
// UPDATE PRODUCT
// =====================
router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    product.title = req.body.title;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.description = req.body.description;
    product.status = req.body.status;

    await product.save();

    res.json(product);
  } catch (err) {
    console.log("Update Product Error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.put("/:id/status", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    product.status = req.body.status;

    await product.save();

    res.json(product);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =====================
// DELETE PRODUCT
// =====================
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;