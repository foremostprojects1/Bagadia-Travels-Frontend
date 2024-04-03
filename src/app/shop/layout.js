import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import React from "react";

const layout = ({ children }) => {
  return (
    <>
       
      <Header />
      {children}
      <Newslatter />
      <Footer />
    </>
  );
};

export default layout;
