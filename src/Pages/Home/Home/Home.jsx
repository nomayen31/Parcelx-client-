import Banner from '../Banner/Banner'
import BrandsName from '../BrandsName/BrandsName'
import HowItWorksSection from '../HowItWorksSection/HowItWorksSection'
import ServicesSection from '../Services/ServicesSection'

const Home = () => {
  return (
    <div>
      <Banner/>
      <HowItWorksSection/>
      <ServicesSection/>
      <BrandsName/>
    </div>
  )
}

export default Home