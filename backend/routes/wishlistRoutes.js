import express from "express";
import User from "../models/User.js";

import auth from "../middleware/auth.js";

const router = express.Router();


// GET wishlist
router.get("/", auth, async (req,res)=>{
    try{

        const user = await User.findById(req.user.id).populate({
  path: "wishlist",
  populate: {
    path: "owner",
    select: "name email",
  },
});

        res.json(user.wishlist);

    }catch(err){
        res.status(500).json({
            message:"Server Error"
        });
    }
});



// ADD wishlist
router.post("/:productId", auth, async(req,res)=>{

    try{

        const user = await User.findById(req.user.id);

        if(!user.wishlist.includes(req.params.productId)){
            user.wishlist.push(req.params.productId);
        }

        await user.save();

        res.json({
            message:"Added to wishlist"
        });

    }catch(err){

        res.status(500).json({
            message:"Server Error"
        });

    }

});




// REMOVE wishlist
router.delete("/:productId", auth, async(req,res)=>{

    try{

        const user = await User.findById(req.user.id);

        user.wishlist =
        user.wishlist.filter(
            id => id.toString() !== req.params.productId
        );


        await user.save();

        res.json({
            message:"Removed from wishlist"
        });


    }catch(err){

        res.status(500).json({
            message:"Server Error"
        });

    }

});


export default router;