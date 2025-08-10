import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import FeaturedProducts from '../components/FeaturedProducts';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
function HomePage() {
  return (
    <div>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <Testimonials />
      <HowItWorks />
    </div>
  );
}

export default HomePage;