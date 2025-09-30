import React from 'react'
import Navbar from './components/Navbar'
import { Route,Routes,useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllTours from './pages/AllTours';
import TourDetails from './pages/TourDetails';
import About from './pages/About';
import MyBookings from './pages/MyBookings';
import Contact from './pages/Contact';

const App = () => {

const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/tours' element={<AllTours/>}/>
          <Route path='/tours/:id' element={<TourDetails/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/mybookings' element={<MyBookings/>}/>
          <Route path='/contact' element={<Contact/>}/>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App