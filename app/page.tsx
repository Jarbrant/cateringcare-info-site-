import ChatWidget from "@/components/ChatWidget";
import FAQSection from "@/components/FAQSection";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Services />
        <WhyUs />
        <FAQSection />
        <Contact />
      </main>

      <Footer />
      <ChatWidget />
    </>
  );
}
