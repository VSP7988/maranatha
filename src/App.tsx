import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import MissionStatement from './components/MissionStatement';
import EventsSection from './components/EventsSection';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AboutSection />
      <MissionStatement />
      <EventsSection />
      <Gallery />
      <Footer />
    </div>
  );
}

export default App;