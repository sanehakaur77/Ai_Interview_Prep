import React from "react";
// import Banner from "../components/ui/Banner";
import Hero from "../components/ui/Hero";
import Features from "./Features";
import WorkingSteps from "./WorkingSteps";
import Testimonial from "../Components/Testimonial";
import Footer from "../Components/common/Footer";
import ContactPage from "../Components/ui/ContactPage";

const Home = () => {
  return (
    <>
      <Hero />
      <WorkingSteps />
      <Testimonial />
      <ContactPage />
      <Features />
      <Footer />
    </>
  );
};

export default Home;
