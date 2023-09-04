import React, {useState, useEffect} from 'react';
import axios from 'axios'; 
import './App.css';
//Using Proxy, dont need to include http://localhost:8000/

function App() {

  //for adding products into DB
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

  //for listing down all records. get data from server at route /products after it is updated.
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

  //for adding products to cart by clicking listed products
  const [cart, setCart] = useState([]);
  //pass the clicked 'product' as a function, then add the product into a cart state.
  const addProductToCart = async(products) => {
    console.log(products);
    //check if added product exists in cart before adding
    //look thru the cart, for i (or any const) in cart, return true if that ProductInCart.id matches. 
    let findProductInCart = await cart.find(i => {
      return i._id === products._id
    });

    if (findProductInCart){
      let newCart = [];
      let newItem; 
      
      cart.forEach(cartItem => {
        if(cartItem._id === products._id){
          newItem = {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            totalAmount: cartItem.price * (cartItem.quantity +1)
          }
          newCart.push(newItem);
        }else{
          newCart.push(cartItem);
        }
      });
      setCart(newCart);

    }else{ //add new product to the cart
      let addingProduct = {
        ...products, //... spread operator copies the existing string, i.e. the product, then allows concatenation of additional information
        'quantity': 1,
        'totalAmount': products.price,
      }
      setCart([...cart, addingProduct]); //set cart state to previous cart + new addedproducts
    }
  }

  //for removing product from cart
  const removeProduct = async (products) => {
    //using filter, get cart items that are NOT the selected product id, set as newcart.
    const newCart = cart.filter(cartItem => cartItem._id !== products._id)
    setCart(newCart);
  }

  //useEffect to calculate totalamount everytime cart changes
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  useEffect(() => {
    let newCartTotalAmount = 0;
    //for each item in cart, add the total amount to the final cart amount.
    //used parseFloat instead of parseInt to allow decimal pts.
    cart.forEach(icart => {
      newCartTotalAmount = newCartTotalAmount + parseFloat(icart.totalAmount);
    }) 
    setCartTotalAmount(newCartTotalAmount);
  }, [cart])

  //for adding to cart by manually keying name and qty. adapted codes from above for add to cart
  const [addProductName, setAddProductName] = useState('');
  const [addQuantity, setAddQuantity] = useState(0);
  const [addProduct, setAddProduct] = useState([]);
  const handleAddToCart = async () => { 
        
    let findProductInCart = await cart.find(i => {
      return i.name === addProductName
    });

    if (findProductInCart){
      let newCart = [];
      let newItem;

      cart.forEach(cartItem => {
        if(cartItem.name === addProductName){
          newItem = {
            ...cartItem,
            quantity: cartItem.quantity + addQuantity,
            totalAmount: cartItem.price * (cartItem.quantity + addQuantity)
          }
          newCart.push(newItem);
        }else{
          newCart.push(cartItem);
        }
      });
      setCart(newCart);
      }
      else{
        //find product in original db using existing findAndUpdate function    
        try {
          const response = await axios.get(`/products/${addProductName}`);
          console.log (response.data);  
          setAddProduct(response.data[0]); //to only get the 1st element in the response array, i.e. product data as an object   
        } catch (error) {
          console.log('error finding product')
        }
        //state updates doesnt happen immediately in async functions. does not work on first click.
        let addingProduct = {
          ...addProduct,    
          'quantity': addQuantity,
          'totalAmount': addProduct.price,
        }
        
        setCart([...cart, addingProduct]);
        
        //reset fields after submit
        //setAddProductName('');
        //setAddQuantity(0);
        //setAddProduct([]);
      }
      }

  //handle checkout: record purchase and reduction in qty for the product stock.
  const checkout = async () => {
    try { 
      for await(const cartItem of cart) {
        axios.post('/purchases', { name: cartItem.name, quantity: cartItem.quantity, price: cartItem.price, totalPrice: cartTotalAmount })
        axios.patch(`/products/${cartItem.name}`, {quantity: cartItem.quantity});
        window.location.reload();   
      }

      //cannot use forEach with await functions because promises not fufilled.
      //cart.forEach (cartItem => {console.log(cartItem)}       
 
      //records are created above, but how to merge cart sales as 1 record.      
         
    } catch (error) {
      console.error('error checking out')
    }
  }

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
  const deletePurchases = async () => {
    try {
      const response = await axios.delete('/purchases');
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error('error deleting purchases')
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

<div>
  <h2>Available products and quantity</h2>
  <h3>Click to add to cart</h3>
  <div className="wrapper"> {/*added definition for grid in app.css*/}
    {products.map((products,index) => {
      return (
      <div className="item" key={index}> 
      <div className="border" onClick={() => addProductToCart(products)}> {/*acts as button for the item*/}
      <h4>{products.name}</h4>
      <div>Quantity:{products.quantity}</div>
      <div>Price:${products.price}</div>          
      </div></div>
      )
      })
    }
</div></div>

<div className="table">
  <table>
    <thead>
      <tr>
        <td>Name</td>
        <td>Quantity</td>
        <td>Price</td>
        <td>TotalAmount</td>
        <td>Action</td>
      </tr>
    </thead>   
    <tbody>
      {cart.map((cartProduct, key) => <tr key={key}>
          <td>{cartProduct.name}</td>
          <td>{cartProduct.quantity}</td>
          <td>{cartProduct.price}</td>
          <td>{cartProduct.totalAmount}</td>
          <td><button onClick={() => removeProduct(cartProduct)}>Remove</button></td>
          </tr>)}  
    </tbody>
  <h4>Cart Total Amount: ${cartTotalAmount}</h4>
  <div>
    { cartTotalAmount 
      !== 0 ? <div>
        <button onClick={checkout}>Check Out</button></div>
      : <div>Please add items to cart first</div>
      }
  </div> 
  </table>  
</div>

<br></br>

<div>
  <h2>Manual Purchasing by Name & Qty</h2>
  <label>
    Product Name:
    <input type = "text" value = {addProductName} onChange = {(e) => setAddProductName(e.target.value)}/>
  </label>
</div>
<div>
  <label>
    Quantity:
    <input type = "number" value = {addQuantity} onChange = {(e) => setAddQuantity(parseInt(e.target.value))}/>
  </label>
</div>
<div>
  <button onClick={handleAddToCart}>Add to Cart</button> 
</div>

<br></br>

<div>
<h2>Deleting database records</h2>
<button onClick={deleteProducts}>Delete Products</button>
<button onClick={deletePurchases}>Delete Purchases</button>
</div>

<br></br>
    
</div>
)}

export default App;
