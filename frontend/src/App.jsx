import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import MyProducts from "./pages/MyProducts";
import Chat from "./pages/Chat";
import Cart from "./pages/Cart";
import Inbox from "./pages/Inbox";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditProduct from "./pages/EditProduct";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/edit-product/:id"
            element={<EditProduct />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;