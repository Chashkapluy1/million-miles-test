import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CarGrid from "@/components/CarGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark">
      <Header />
      <Hero />
      <CarGrid />
      <Footer />
    </main>
  );
}
