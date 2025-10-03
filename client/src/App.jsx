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
import Layout from './pages/Dashboard/Layout.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import AddTour from './pages/Dashboard/AddTour.jsx';
import ListTour from './pages/Dashboard/ListTour.jsx';



const App = () => {

const isAdminpath = useLocation().pathname.includes("admin");

  return (
    <div>
      {!isAdminpath && <Navbar />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/tours' element={<AllTours/>}/>
          <Route path='/tours/:id' element={<TourDetails/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/mybookings' element={<MyBookings/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/admin' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='add-tour' element={<AddTour/>}/>
            <Route path='list-tour' element={<ListTour/>}/>
          </Route>
        </Routes>
      </div>
        {!isAdminpath && <Footer />} 
    </div>
  )
}

export default App