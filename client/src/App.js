import React, {useState, useEffect} from 'react';
import axios from 'axios'; //Alternative method to 'fetch'
import './App.css';
//Using Proxy, dont need to include http://localhost:8000/

function App() {

  //for adding into DB --> can consider putting on different page
  const [newProductName, setNewProductName] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState(0);
  const [newProductPrice, setNewProductPrice] = useState(0);
  const handleAddProduct = async () => {
    try {
      await axios.post('/products', {name: newProductName, quantity: newProductQuantity, price: newProductPrice});
      //reset input fields after each addition
      setNewProductName('');
      setNewProductQuantity(0);
      setNewProductPrice(0);
      window.location.reload(); //refresh page
    } catch (error) {
      console.log('error adding new products')
    }
  }

  //for listing down all records
  //get data from server at route /products after it is updated.
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    try {
        const response = await axios.get("/products");
        setProducts(response.data);
        console.log(response.data);
    } catch (error){
        console.log('cannot load products');
    }
  };
  //call useEffect when the application first loads.
  useEffect(() => {
    getProducts();
  }, []) //empty array [] for this to be called on initial loading

  
  //for finding and updating of products
  const [findProductName, setFindProductName] = useState('');
  const [foundProduct, setFoundProduct] = useState([]);
  const [updateProductQuantity, setUpdateProductQuantity] = useState(0);
  const [updateProductPrice, setUpdateProductPrice] = useState(0);

  const handleFindProduct = async () => {
    try {
      const response = await axios.get(`/products/${findProductName}`);
      setFoundProduct(response.data);

    } catch (error) {
      console.log('error finding product')
    }
  }
    
  const handleUpdateProduct = async () => {
    try {
      await axios.put(`/products/${findProductName}`, {"quantity": updateProductQuantity, "price": updateProductPrice});
          
      //reset input fields after each addition
      setFindProductName('');
      setFoundProduct([]);
      setUpdateProductQuantity(0);
      setUpdateProductPrice(0);
      window.location.reload(); //refresh page to show updates

    } catch (error) {
      console.log('error updating product')
    }
  }

  //add to cart and check out/////////////////////////////////////////////////////////////
  

//to delete and clear databases
  const deleteProducts = async () => {
    try {
      const response = await axios.delete('/products');
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error('error deleting products')
    }
  }

    
return (

<div className="App">
<h1><u>Point of Sales System</u></h1>

<h2>Add New Products</h2>
<div>
  <label>
    New Product Name:
    <input type = "text" value = {newProductName} onChange = {(e) => setNewProductName(e.target.value)}/>
  </label>
</div>
<div>
  <label>
    New Product Quantity:
    <input type = "number" value = {newProductQuantity} onChange = {(e) => setNewProductQuantity(parseInt(e.target.value))}/>
  </label>
</div>
<div>
  <label>
    New Product Price:
    <input type = "number" value = {newProductPrice} onChange = {(e) => setNewProductPrice(parseFloat(e.target.value))}/> {/*how to resolve float byte error*/}
  </label>
</div>
<div>
  <button onClick = {handleAddProduct}>Add Product</button>
</div>
    
<br></br>

<h2>Updating Products</h2>
<div>
  <label>
    Product Name:
    <input type = "text" value = {findProductName} onChange = {(e) => setFindProductName(e.target.value)}/>
  </label>
</div>
<div>
  <button onClick = {handleFindProduct}>Find Product</button>
</div>
{foundProduct.map((foundProduct,index) => { 
  return ( 
  <div key={index}>
    <p>Product Name: {foundProduct.name}</p>
    <p>Product Price: ${foundProduct.price}</p>
    <p>Product Quantity: {foundProduct.quantity}</p> 
    <label>
      Update Product Quantity:
      <input type = "number" value = {updateProductQuantity} onChange = {(e) => setUpdateProductQuantity(parseInt(e.target.value))}/>
    </label>
    <label>
      Update Product Price:
      <input type = "number" value = {updateProductPrice} onChange = {(e) => setUpdateProductPrice(parseFloat(e.target.value))}/>
    </label>
    <div>
      <button onClick = {handleUpdateProduct}>Update Product</button>
    </div>
  </div> )}
)}

<br></br>

{/*add to cart and check out functions*/}



{/*to delete and clear databases*/}
<div>
<h2>Deleting database records</h2>
<button onClick={deleteProducts}>Delete Products</button>

</div>

<br></br>
    
</div>
)}

export default App;
