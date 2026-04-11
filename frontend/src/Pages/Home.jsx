import React from "react";
// import Banner from "../components/ui/Banner";
import Hero from "../components/ui/Hero";
import Features from "./Features";
import WorkingSteps from "./WorkingSteps";
import Testimonial from "../Components/Testimonial";
import Footer from "../Components/common/Footer";

const Home = () => {
  return (
    <>
      {/* <Banner /> */}
      <Hero />
      <WorkingSteps />
      <Testimonial />
      <Features />
      <Footer />
    </>
  );
};

export default Home;
