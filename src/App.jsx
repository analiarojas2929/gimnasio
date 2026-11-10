
import { useState } from "react";
import About from "./components/About.jsx";
import Classes from "./components/Classes.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Navbar from "./components/Navbar.jsx";
import Plans from "./components/Plans.jsx";
import Schedule from "./components/Schedule.jsx";
import Inscription from "./components/Inscription.jsx";

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState("");

  function choosePlan(plan) {
    setSelectedPlan(plan);

    setTimeout(() => {
      document.getElementById("inscripcion")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
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

        <Inscription selectedPlan={selectedPlan} />

        <Classes />
        <Schedule />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
