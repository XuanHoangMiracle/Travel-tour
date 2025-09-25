import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import Offers from '../components/Offers'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <>
        <Hero/>
        <FeaturedDestination/>
        <Offers />
        <NewsLetter/>
    </>
  )
}

export default Home