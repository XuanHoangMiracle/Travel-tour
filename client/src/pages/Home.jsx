import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import Offers from '../components/Offers'
import NewsLetter from '../components/NewsLetter'
import ChatbotWidget from '../components/Chatbot'

const Home = () => {
  return (
    <>
        <Hero/>
        <FeaturedDestination/>
        <Offers />
        <NewsLetter/>
        <ChatbotWidget/>
    </>
  )
}

export default Home