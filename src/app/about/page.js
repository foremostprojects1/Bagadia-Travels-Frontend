import Breadcrumb from "@/components/common/Breadcrumb";
import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Home2Activities from "@/components/activities/Home2Activities";
import Home2Team from "@/components/team/Home2Team";
import Home2WhyChoose from "@/components/whyChoose/Home2WhyChoose";
import Home2About from "@/components/about/Home2About";
export const metadata = {
  title: "Magical Journey - Where the Journey Begins!",
  description:
    "To inspire and empower travelers to explore the world with confidence, providing exceptional service, unforgettable experiences, and fostering a deep appreciation for diverse cultures and destinations.",
  icons: {
    icon: "/assets/img/new_logo3.png",
  },
};
const page = () => {
  return (
    <>
       
      <Header />
      <Breadcrumb pagename="About Us" pagetitle="About Us" />
      <Home2About />
      <Home2WhyChoose />
      {/* <Home2Activities /> */}
      {/* <Home2Team /> */}
      {/* <Newslatter /> */}
      <Footer />
    </>
  );
};

export default page;
