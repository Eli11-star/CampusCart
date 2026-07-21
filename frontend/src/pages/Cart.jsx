import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

function Cart() {

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
  const token = localStorage.getItem("token");

  setLoading(true);

  API.get("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      setCart(res.data);
    })
    .catch((err) => {
      toast.error(
        err.response?.data?.message ||
        "Couldn't load your cart."
      );
    })
    .finally(() => {
      setLoading(false);
    });
};

  useEffect(() => {
    fetchCart();
  }, []);

  
const totalPrice = cart.reduce(
  (total, item) => total + (item.product?.price || 0) * item.quantity,
  0
);

const handleCheckout = async () => {
  const token = localStorage.getItem("token");

  if (cart.filter((item) => item.product).length === 0) {
    toast.error("Your cart is empty.");
    return;
  }

  try {
    const validCart = cart.filter((item) => item.product);

    for (const item of validCart) {
      await API.post(
        `/purchase/${item.product._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    toast.success("Purchase successful! 🎉");

    // Refresh cart after purchase
    fetchCart();

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Checkout failed."
    );
  }
};


  return (
    <>
      <Navbar />

      <div className="container">

        <h1>🛒 My Cart</h1>

        {cart
        .filter((item) => item.product).length === 0 ? (
          <h2>Your cart is empty.</h2>
) : (
  cart.filter((item) => item.product)
        .map((item) => (

          <div className="card" key={item.product._id}>

            <img
              src={item.product.image}
              width="150"
              alt={item.product.title}
            />

            <h2>{item.product.title}</h2>

           <h3>
  ₹{item.product.price.toLocaleString()}
</h3>

            <p>Quantity: {item.quantity}</p>

          </div>

    

        ))
      )}



      </div>

      <div className="cart-summary">
  <h2>Total: ₹{totalPrice.toLocaleString()}</h2>

  <button
    className="checkout-btn"
    onClick={handleCheckout}
  >
    Proceed to Checkout
  </button>
</div>

    </>
  );
}

export default Cart;