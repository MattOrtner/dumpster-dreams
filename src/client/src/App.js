import { useState, useEffect } from 'react'
import request from 'superagent'
import './App.css'

const INVENTORY = [
  {
    name: 'dresser',
    price: 30.85,
  },
  {
    name: 'sweet-mirror',
    price: 345,
  },
  {
    name: 'table',
    price: 41.23,
  },
]

const CheckOut = (props) => {
  const getTotal = () => {
    return props.cart.reduce((total, item) => (total + item.price), 0)
  }
  console.log(props.someOtherThing)
  return (
    <div className='checkout'>
      <h2 className='checkout-title'>CHECKOUT</h2>
      <button onClick={props.toMainPage}>back</button>
      {props.cart.map((item) => {
        return <div className='item'>{item.name}</div>
      })}
      <p>cost of items: </p>
      <p>TOTAL: $ {getTotal()}</p>
      <button>PayPal</button>
    </div>
  )
}
const MainPage = (props) => {
  return (
    <div>
      <button onClick={props.toCheckout}>To Checkout</button>
      {props.inventory.map((item, index) =>
        <div className='item-card' onClick={props.addToCart(index)} key={`${index}-item-card`}>
          <p>{item.name}</p>
          <p>{item.price}</p>
        </div>
      )}
    </div>
  )
}
function App() {
  const [inventory] = useState(INVENTORY)
  const [isCheckout, setCheckout] = useState(false)

  useEffect(() => {
    (async () => {
      const result = await request.get('/users')

      console.log(result.body)

    })();
  });

  const addToCart = (index) => event => {
    // const updatedItem = { ...inventory[index], inCart: true }
    // setInventory([
    //   ...inventory.slice(0, index),
    //   updatedItem,
    //   ...inventory.slice(index + 1)
    // ])
  }

  return (
    <div className='App'>
      {isCheckout
        ? <CheckOut
          cart={inventory.filter(item => item.inCart)}
          toMainPage={() => setCheckout(false)} />
        : <MainPage
          inventory={inventory}
          toCheckout={() => setCheckout(true)}
          addToCart={addToCart}
        />
      }
    </div>
  )

}

export default App;
