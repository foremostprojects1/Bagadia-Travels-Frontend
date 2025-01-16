import About1 from "@/components/about/About1";
import Home1Activities from "@/components/activities/Home1Activities";
import Banner1 from "@/components/banner/Banner1";
import Banner1Bottom from "@/components/banner/Banner1Bottom";
import Home1Banner2 from "@/components/banner/Home1Banner2";
import Newslatter from "@/components/common/Newslatter";
import Destination1 from "@/components/destination/Destination1";
import Home1FacilitySlide from "@/components/facilitySlide/Home1FacilitySlide";
import Home1Facilities2 from "@/components/facilitySlide/Home1Fecilities2";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Home1Testimonail from "@/components/testimonial/Home1Testimonail";
import Home1TourPackage from "@/components/tourPackage/Home1TourPackage";
import Home1Vise from "@/components/visaComponents/Home1Vise";
import Home1WhyChoose from "@/components/whyChoose/Home1WhyChoose";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const metadata = {
  title: "Magical Journey - Where the Journey Begins!",
  description:
    "To inspire and empower travelers to explore the world with confidence, providing exceptional service, unforgettable experiences, and fostering a deep appreciation for diverse cultures and destinations.",
  icons: {
    icon: "/assets/img/new_logo3.png",
  },
};
export default function Home() {
  return (
    <>
      <ToastContainer />
      <Header />
      <Banner1 />
      {/* <Banner1Bottom /> */}
      <>
    <div style={{ marginBottom: '2vh',marginTop:'2vh' }}>
      {/* Content goes here */}
    </div>
  </>
      <About1 />
      {/* <Destination1 /> */}
      <Home1Facilities2 />
      <Home1FacilitySlide />
      {/* <Home1TourPackage /> */}

      <>
    <div style={{ marginBottom: '2vh',marginTop:'2vh' }}>
      {/* Content goes here */}
    </div>
  </>
  
      <Home1WhyChoose />
      {/* <Home1popularTour /> */}
      {/* <Home1Activities /> */}
      {/* <Home1Banner2 /> */}
      {/* <Home1Testimonail /> */}

      {/* <Home1Vise /> */}
      {/* <Newslatter /> */}
      <Footer />
    </>
  );
}
