import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Product from "./models/Products.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import User from "./models/User.js";
import Wishlist from "./models/Wishlist.js";
import Chat from "./models/Chat.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import purchaseRoutes from "./routes/purchaseRoutes.js";

const result = dotenv.config({ path: "./.env" });
console.log(result);
console.log(process.env.MONGO_URI);
import mongoose from "mongoose";


const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/chat", chatRoutes);
app.use("/cart", cartRoutes);
app.use("/purchase", purchaseRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to Student Marketplace API");
});

// Products route
app.get("/products", async (req, res) => {
  try {
   const products = await Product.find().populate("owner", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("owner", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/products",authMiddleware, async (req, res) => {
  console.log("POST route reached");
  console.log(req.body);

  try {
    const product = new Product({
      ...req.body,
      owner: req.user.id
    });

    const savedProduct = await product.save();

    console.log("Saved successfully:", savedProduct);

    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);

    res.status(500).json({
      message: err.message,
      name: err.name,
      errors: err.errors,
    });
  }
});


app.put("/products/:id", authMiddleware, async (req, res) => {
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
    res.status(500).json({
      message: err.message,
    });
  }
});
app.put("/products/:id/status", authMiddleware, async (req, res) => {
  try {
    console.log("STATUS ROUTE HIT");

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Only the owner can change the status
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
      message: err.message,
    });
  }
});
  app.get("/test", (req, res) => {
  console.log("🚀 TEST ROUTE HIT");
  res.send("This is MY server");
});

const PORT = process.env.PORT || 5000;
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });
app.delete("/products/:id", authMiddleware, async (req, res) => {
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
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/wishlist/:productId", authMiddleware, async (req, res) => {
  try {
    const alreadyExists = await Wishlist.findOne({
      user: req.user.id,
      product: req.params.productId,
    });

    if (alreadyExists) {
      return res.status(400).json({
        message: "Already in wishlist",
      });
    }

    const wishlist = new Wishlist({
      user: req.user.id,
      product: req.params.productId,
    });

    await wishlist.save();

    res.json({
      message: "Added to wishlist",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.put("/wishlist/:productId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const productId = req.params.productId;

    if (user.wishlist.includes(productId)) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
app.get("/wishlist", authMiddleware, async (req, res) => {
  try {

    const wishlist = await Wishlist.find({
  user: req.user.id,
}).populate({
  path: "product",
  populate: {
    path: "owner",
    select: "name email",
  },
});

    res.json(wishlist);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
});
app.delete("/wishlist/:productId", authMiddleware, async (req, res) => {
  try {

    await Wishlist.findOneAndDelete({
      user: req.user.id,
      product: req.params.productId,
    });

    res.json({
      message: "Removed from wishlist",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
app.get("/my-products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({
      owner: req.user.id,
    }).populate("owner", "name email");

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
io.on("connection", (socket) => {
  console.log("✅ User Connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`Joined chat ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected");
  });
});


httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});