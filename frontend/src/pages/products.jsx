
import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";

function Products() {
  
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
 const [price, setPrice] = useState(""); 

 const [editingId, setEditingId] = useState(null);
const [isEditing, setIsEditing] = useState(false);

const [image, setImage] = useState("");

const [search, setSearch] = useState("");

const [category, setCategory] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");

const [loading, setLoading] = useState(true);

const [sort, setSort] = useState("default");

const [showModal, setShowModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);

const user = JSON.parse(localStorage.getItem("user"));
const [description, setDescription] = useState("");

const [wishlist, setWishlist] = useState([]);


useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
  }
}, [navigate]);

 const fetchProducts = () => {
  setLoading(true);

  API
    .get("/products")
    .then((response) => {
      setProducts(response.data);
       setLoading(false);
    })
    .catch((err) => {
  toast.error("Couldn't load products.");
  setLoading(false);
});
};

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  

const handleDelete = (id) => {
  setDeleteId(id);
  setShowModal(true);
};

const confirmDelete = () => {
  const token = localStorage.getItem("token");

  API
    .delete(`/products/${deleteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      toast.success("Product deleted successfully!");
      fetchProducts();
      setShowModal(false);
      setDeleteId(null);
    })
    .catch((err) => {
  toast.error(
    err.response?.data?.message ||
    "Failed to delete product."
  );
});
};



const handleEdit = (product) => {
  setProductName(product.title);
  setPrice(product.price);
  setCategory(product.category);
  setImage(product.image);
  setDescription(product.description);

  setEditingId(product._id);
  setIsEditing(true);
};

const handleAddOrUpdate = () => {
  if (
    productName.trim() === "" ||
    price === "" ||
    category === "" ||
    image.trim() === ""
  ) {
    toast.error("Please fill all fields!");
    return;
  }

  if (Number(price) <= 0) {
    toast.error("Price must be greater than 0.");
    return;
  }

  const productData = {
    title: productName,
    price: Number(price),
    category,
    image,
    description,
  };

 

  if (isEditing) {

const token = localStorage.getItem("token");

    API
      .put(`/products/${editingId}`, productData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
      )
      .then(() => {
        fetchProducts();

        toast.success("Product updated successfully!");

        setProductName("");
        setPrice("");
        setCategory("");
        setImage("");
        setDescription("");

        setIsEditing(false);
        setEditingId(null);
      })
      .catch((err) => {
  toast.error(
    err.response?.data?.message ||
    "Failed to update product."
  );
});
  } else {
    const token = localStorage.getItem("token");
    API
      .post("/products", productData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)
     .then(() => {
  

  setTimeout(() => {
        toast.success("Product added successfully!");
         }, 100);

       fetchProducts();

        

        setProductName("");
        setPrice("");
        setCategory("");
        setImage("");
      })
      .catch((err) => {
  toast.error(
    err.response?.data?.message ||
    "Failed to add product."
  );
});
  }
};


const filteredProducts = products
  .filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    return 0;
  });
const handleImageUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "student_marketplace");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/pekzsoyg/image/upload",
      formData
    );

    setImage(response.data.secure_url);

    toast.success("Image uploaded successfully!");
  } 
  catch {
  toast.error("Image upload failed.");
}
};
const loadingToast = toast.loading("Uploading image...");

try {
  const response = await axios.post(
    "https://api.cloudinary.com/v1_1/pekzsoyg/image/upload",
    formData
  );

  setImage(response.data.secure_url);

  toast.dismiss(loadingToast);
  toast.success("Image uploaded successfully!");
} catch {
  toast.dismiss(loadingToast);
  toast.error("Image upload failed.");
}


const fetchWishlist = () => {
  const token = localStorage.getItem("token");

  API
    .get("/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setWishlist(res.data.map((item) => item._id));
    })
    .catch(() => {
  toast.error("Couldn't load wishlist.");
});
};

const toggleWishlist = async (productId) => {
  const token = localStorage.getItem("token");

  try {
    if (wishlist.includes(productId)) {
      await API.delete(
        `/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Removed from wishlist ❤️");
    } else {
      await API.post(
        `/wishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Added to wishlist ❤️");
    }

    fetchWishlist();

  } catch (err) {
  toast.error(
    err.response?.data?.message ||
    "Wishlist update failed."
  );
}
};

const addToCart = async (productId) => {
  const token = localStorage.getItem("token");

  try {
    await API.post(
      `/cart/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Added to cart 🛒");

  } catch (err) {
  toast.error(
    err.response?.data?.message ||
    "Couldn't add item to cart."
  );
}
};

const startChat = async (sellerId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await API.post(
      `/chat/start/${sellerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    

    navigate(`/chat/${res.data._id}`);
  } catch (err) {
  toast.error(
    err.response?.data?.message ||
    "Couldn't start chat."
  );
}
};


  return (

    <> 
    <Navbar />

    <div className="container">


      <div className="hero">
  <h1>🛒 CampusCart</h1>

<p>
  Buy. Sell. Connect.
</p>

<span>
  Discover affordable products from fellow students on your campus.
</span>
</div>

<div className="stats">

  <div className="stat-card">
    <h2>{products.length}</h2>
    <p>Total Products</p>
  </div>

  <div className="stat-card">
    <h2>
      ₹{products
        .reduce((sum, p) => sum + p.price, 0)
        .toLocaleString()}
    </h2>
    <p>Total Marketplace Value</p>
  </div>
  <div className="stat-card">
    <h2>{wishlist.length}</h2>
    <p>Wishlist Items</p>
</div>

</div>

<div className="categories">
  <button
    className={selectedCategory === "All" ? "active-category" : ""}
    onClick={() => setSelectedCategory("All")}
  >
     All
  </button>

  <button
    className={selectedCategory === "Electronics" ? "active-category" : ""}
    onClick={() => setSelectedCategory("Electronics")}
  >
     Electronics
  </button>

  <button
    className={selectedCategory === "Books" ? "active-category" : ""}
    onClick={() => setSelectedCategory("Books")}
  >
     Books
  </button>

  <button
    className={selectedCategory === "Stationery" ? "active-category" : ""}
    onClick={() => setSelectedCategory("Stationery")}
  >
     Stationery
  </button>
</div>
      

      <div className="search-container">
<input
  type="text"
  placeholder=" Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-input"

/>
</div>
      <div className="form-container">  </div>
     <div className="form"> 
      <input
  type="text"
  placeholder="Product Name"
  value={productName}
  onChange={(e) => setProductName(e.target.value)}
/>


<input
  type="number"
  placeholder="Price"
  value={price}
  onChange={(e) => setPrice(e.target.value)}

/>


<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="">Select Category</option>
  <option value="Electronics">Electronics</option>
  <option value="Books">Books</option>
  <option value="Stationery">Stationery</option>
</select>


<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
/>
{image && (
  <img
    src={image}
    alt="Preview"
    style={{
      width: "200px",
      marginTop: "15px",
      borderRadius: "10px",
    }}
  />
)}
<textarea
  rows="4"
  placeholder="Describe your product..."
  value={description}
  onChange={(e) => setDescription(e.target.value)}
></textarea>

<select
  value={sort}
  onChange={(e) => setSort(e.target.value)}
>
  <option value="default">Default</option>
  <option value="low">Price: Low to High</option>
  <option value="high">Price: High to Low</option>
</select>



<button onClick={handleAddOrUpdate}>
  {isEditing ? "Update Product" : "Add Product"}
</button>
</div>

{showModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Delete Product?</h2>

      <p>
        Are you sure you want to delete this product?
      </p>

      <div className="modal-buttons">
        <button
          className="cancel-btn"
          onClick={() => {
            setShowModal(false);
            setDeleteId(null);
          }}
        >
          Cancel
        </button>

        <button
          className="confirm-btn"
          onClick={confirmDelete}
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}

<div className="products">
  {loading ? (
    <div className="loading">
  Loading products...
</div>
  ) : filteredProducts.length === 0 ? (
    <h2>No Products Found</h2>
  ) : ( 
    filteredProducts.map((product) => (
     
      
   <div
  className="card"
  key={product._id}
  style={{ position: "relative" }}
  onClick={() => navigate(`/products/${product._id}`)}
>
{product.status === "Sold" && (
  <div
    style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "#dc3545",
      color: "white",
      padding: "5px 10px",
      borderRadius: "15px",
      fontWeight: "bold",
      zIndex: 10,
    }}
  >
    SOLD
  </div>
)}

<button
  className="wishlist-btn"
  onClick={(e) => {
    e.stopPropagation();
    toggleWishlist(product._id);
  }}
>
  {wishlist.includes(product._id) ? "❤️" : "🤍"}
</button>

  <div className="card-image">
    <img
      src={product.image || "https://via.placeholder.com/300"}
      alt={product.title}
      className="product-image"
    />

    <span className="category-tag">
      {product.category}
    </span>
  </div>

  <div className="card-body">
    <h2>{product.title}</h2>

    <h3 className="price">
      ₹{Number(product.price || 0).toLocaleString()}
    </h3>
    <p className="product-description">
  {product.description?.slice(0,70)}...
</p>

    <div className="card-buttons">
  {String(product.owner?._id) === String(user.id) ? (
    <>
      
      
      
      <button
        className="edit-btn"
        onClick={(e) => {
  e.stopPropagation();
  handleEdit(product);
}}
      >
        ✏ Edit
      </button>

      <button
        className="delete-btn"
       onClick={(e) => {
  e.stopPropagation();
  handleDelete(product._id);
}}
      >
        🗑 Delete
      </button>
    </>
  ) : (
    <>
 <button
  className="cart-btn"
  disabled={product.status === "Sold"}
  style={{
    opacity: product.status === "Sold" ? 0.6 : 1,
    cursor:
      product.status === "Sold"
        ? "not-allowed"
        : "pointer",
  }}
  onClick={(e) => {
    e.stopPropagation();

    if (product.status === "Sold") return;

    addToCart(product._id);
  }}
>
  {product.status === "Sold"
    ? "Sold Out"
    : "🛒 Add to Cart"}
</button>

  <button
  className="contact-btn"
  disabled={product.status === "Sold"}
  style={{
    opacity: product.status === "Sold" ? 0.6 : 1,
    cursor:
      product.status === "Sold"
        ? "not-allowed"
        : "pointer",
  }}
  onClick={(e) => {
    e.stopPropagation();

    if (product.status === "Sold") return;

    startChat(product.owner._id);
  }}
>
  {product.status === "Sold"
    ? "❌ Sold"
    : "💬 Chat with Seller"}
</button>
</>
  )}
</div>
  </div>
</div> 
    ))
  )}
</div>

  </div>
  </>
  );
}


export default Products;