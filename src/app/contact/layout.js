import Breadcrumb from "@/components/common/Breadcrumb";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import React from "react";
export const metadata = {
  title: "Magical Journey - Where the Journey Begins!",
  description:
    "To inspire and empower travelers to explore the world with confidence, providing exceptional service, unforgettable experiences, and fostering a deep appreciation for diverse cultures and destinations.",
  icons: {
    icon: "/assets/img/new_logo3.png",
  },
};
const layout = ({ children }) => {
  return (
    <>
       
      <Header />
      <Breadcrumb pagename="Contact Us" pagetitle="Contact Us" />
      {children}
      <Footer />
    </>
  );
};

export default layout;
