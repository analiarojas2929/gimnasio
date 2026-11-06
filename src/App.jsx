import { useState } from "react";
import About from "./components/About.jsx";
import Classes from "./components/Classes.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Navbar from "./components/Navbar.jsx";
import Plans from "./components/Plans.jsx";
import Schedule from "./components/Schedule.jsx";

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState("");

  function choosePlan(plan) {
    setSelectedPlan(plan);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Plans onChoosePlan={choosePlan} />
        <Classes />
        <Schedule />
        <Contact selectedPlan={selectedPlan} />
      </main>
      <Footer />
    </>
  );
}
