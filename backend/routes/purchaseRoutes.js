import express from "express";
import Purchase from "../models/Purchase.js";
import Product from "../models/Products.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/:productId", auth, async (req, res) => {

    try {

        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.status === "Sold") {
            return res.status(400).json({
                message: "Already sold"
            });
        }

        await Purchase.create({

            buyer: req.user.id,
            product: product._id

        });

        product.status = "Sold";

        await product.save();

        await User.findByIdAndUpdate(req.user.id, {
    $pull: {
        cart: {
            product: product._id
        }
    }
});

        res.json({
            message: "Purchase Successful"
        });

    } catch (err) {

        res.status(500).json({
            message: "Server Error"
        });

    }

});

router.get("/", auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({
      buyer: req.user.id,
    })
      .populate("product")
      .sort({ purchasedAt: -1 });

    res.json(purchases);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;