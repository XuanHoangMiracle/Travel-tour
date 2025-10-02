import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, cities } from '../../assets/assets'

const AddTour = () => {

    const [images,setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null
    })
    const [inputs,setInputs] = useState({
        Tour: '',
        priceTour: 0,
        cities: '',
        description: '',
        amenties: {
            'free Wifi': false,
            'Máy bay': false,
            'Bữa sáng': false,
            'Leo núi': false,
            'Oto' : false,
        }
    }) 

  return (
        <form >
            <div>
            <Title align='left' font='outfit' title='Thêm tour mới' subTitle='Thêm tour mới vào danh sách tour của Travel Tours'/>
            {/*Tải hình ảnh*/}
            <p className='text-gray-800 mt-10'>Ảnh</p>
            <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
                {Object.keys(images).map((key)=>(
                    <label htmlFor={`tourImages${key}`} key={key}>
                        <img className='max-h-13 cursor-pointer opacity-80' 
                        src={images[key]? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
                        <input type='file' accept='image/*' id={`tourImages${key}`} hidden 
                        onChange={(e)=>setImages({...images,[key]: e.target.files[0]})}/>
                    </label>
                ))}
                </div>
                {/*Location*/}
                    <div className='flex-1 max-w-48'>
                        <p className='text-gray-800 mt-4'>Vị trí</p>
                        <select
                        value={inputs.city}
                        onChange={e => setInputs(prev => ({ ...prev, city: e.target.value }))}
                        className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'
                        >
                        <option value=''>Chọn thành phố</option>
                        {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                        </select>
                    </div>
                    <div>
                        <p className='mt-4 text-gray-800'>
                            Giá
                        </p>
                        <input type="number" placeholder='1' className='border border-gray-300 mt-1 rounded p-2 w-24' 
                        value={inputs.priceTour} onChange={e=> setInputs({...inputs,priceTour: e.target.value})}/>
                    </div>
                </div>
                {/*Service*/}
                <p className='text-gray-800 mt-4'>Dịch vụ</p>
                <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
                    {Object.keys(inputs.amenties).map((amenity,index)=>(
                        <div key={index}>
                            <input type='checkbox' id={`amenities${index+1}`} checked ={inputs.amenties[amenity]} onChange={()=>setInputs({...inputs,amenties:{...inputs.amenties,[amenity]: !inputs.amenties [amenity]}})} />
                            <label htmlFor={`amenities ${index+1}`}>  {amenity}</label>
                        </div>
                    ))}
                </div>
                <button className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer'>Thêm Tour</button>
        </form>
  )
}

export default AddTour