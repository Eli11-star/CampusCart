import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import "../App.css";


function EditProduct(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [title,setTitle] = useState("");
  const [price,setPrice] = useState("");
  const [category,setCategory] = useState("");
  const [description,setDescription] = useState("");


  useEffect(()=>{

    API.get(`/products/${id}`)
    .then((res)=>{

      const product = res.data;

      setTitle(product.title);
      setPrice(product.price);
      setCategory(product.category);
      setDescription(product.description);

    })
    .catch(console.log);


  },[id]);



  const handleUpdate = async(e)=>{

    e.preventDefault();

    const token = localStorage.getItem("token");


    try{

      await API.put(`/products/${id}`,{

        title,
        price,
        category,
        description

      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });


      alert("Product Updated!");

      navigate("/profile");


    }catch(error){

      console.log(error);

    }

  };


  return(
    <>
      <Navbar />

      <div className="form-container">

        <h1>Edit Product</h1>


        <form onSubmit={handleUpdate}>


          <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Product Name"
          />


          <input
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
          placeholder="Price"
          />


          <input
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          placeholder="Category"
          />


          <textarea
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          placeholder="Description"
          />


          <button>
            Update Product
          </button>


        </form>


      </div>

    </>
  )

}


export default EditProduct;