import Banner from '../Banner/Banner'
import BrandsName from '../BrandsName/BrandsName'
import Features from '../Features/Features'
import HowItWorksSection from '../HowItWorksSection/HowItWorksSection'
import MerchantSection from '../MerchantSection/MerchantSection'
import Review from '../Review/Review'
import ServicesSection from '../Services/ServicesSection'

const Home = () => {
  return (
    <div>
      <Banner/>
      <HowItWorksSection/>
      <ServicesSection/>
      <BrandsName/>
      <Features/>
      <MerchantSection/>
      <Review/>
    </div>
  )
}

export default Home