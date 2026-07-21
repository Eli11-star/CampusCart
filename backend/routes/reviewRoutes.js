
import express from "express";
import Review from "../models/Review.js";
import Purchase from "../models/Purchase.js";
import auth from "../middleware/auth.js";

const router = express.Router();


// ========================================
// GET REVIEWS FOR A PRODUCT
// ========================================

router.get("/:productId", async (req, res) => {
  try {
    console.log("Getting reviews for product:", req.params.productId);

    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });

    console.log("Reviews found:", reviews);

    res.json(reviews);

  } catch (err) {
    console.error("GET REVIEWS ERROR:", err);

    res.status(500).json({
      message: "Couldn't load reviews.",
      error: err.message,
    });
  }
});


// ========================================
// ADD REVIEW
// ONLY USERS WHO PURCHASED CAN REVIEW
// ========================================

router.post("/:productId", auth, async (req, res) => {
  try {

    const { rating, comment } = req.body;

    // Check rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5.",
      });
    }

    // Check comment
    if (!comment || comment.trim() === "") {
      return res.status(400).json({
        message: "Please write a review.",
      });
    }


    // Check if user purchased product
    const purchase = await Purchase.findOne({
      buyer: req.user.id,
      product: req.params.productId,
    });

    if (!purchase) {
      return res.status(403).json({
        message:
          "You can only review products you have purchased.",
      });
    }


    // Check if already reviewed
    const existingReview = await Review.findOne({
      product: req.params.productId,
      reviewer: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product.",
      });
    }


    // Create review
    const review = await Review.create({
      product: req.params.productId,
      reviewer: req.user.id,
      rating,
      comment,
    });


    // Populate reviewer name
    await review.populate("reviewer", "name");


    res.status(201).json(review);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Couldn't add review.",
    });

  }
});


export default router;

