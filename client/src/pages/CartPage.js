import React from 'react';
import Header from '../components/common/header/header';
import Footer from '../components/common/footer/footer';
import Cart from '../components/cart/cart';
import Payment from '../components/cart/payment';
const Home = () => {
  return(
    <div>
      <Header />
      <Cart />
      <Payment />
      <Footer />
    </div>
  )
};

export default Home;


