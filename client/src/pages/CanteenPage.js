import React from 'react';
import Header from '../components/common/header/header';
import Footer from '../components/common/footer/footer';
import MenuPage from '../components/clientMenu/menuView';
const Menu = () => {
  return(
    <div>
      <Header />
      <MenuPage/>
      <Footer />
    </div>
  )
};

export default Menu;


