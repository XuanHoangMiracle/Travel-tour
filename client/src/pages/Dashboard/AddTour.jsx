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
        name: '',   
        Tour: '',
        priceTour: 0,
        cities: '',
         itinerary: '', 
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
            {/* Tên tour */}
        <p className='text-gray-800 mt-6'>Tên tour</p> 
        <input                                    
          type='text'                            
          placeholder='Nhập tên tour, ví dụ: Du lịch Hội An 3N2Đ'
          className='border border-gray-300 mt-1 rounded p-2 w-full max-w-lg'
          value={inputs.name}                     
          onChange={e => setInputs(prev => ({ ...prev, name: e.target.value }))}
          required                              
        />


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
                    <div className='flex-1 max-w-48 '>
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
                        <input min={1} type="number" placeholder='1' className='border border-gray-300 mt-1 rounded p-2 w-24' 
                        value={inputs.priceTour} onChange={e=> setInputs({...inputs,priceTour: e.target.value})} required/>
                    </div>
                </div>
                      {/* Lịch trình (itinerary) */}
                <p className='text-gray-800 mt-6'>Lịch trình</p>
                <textarea                                  
                rows={6}                                 
                placeholder={`Ngày 1: Đón khách – tham quan...\nNgày 2: Phố cổ, chợ đêm...\nNgày 3: Tự do – trả khách...`} 
                className='border border-gray-300 mt-1 rounded p-2 w-full max-w-3xl' 
                value={inputs.itinerary}               
                onChange={e => setInputs(prev => ({ ...prev, itinerary: e.target.value }))}
                required />
               {/* Service */}
            <p className='text-gray-800 mt-4'>Dịch vụ</p>
            <div className='mt-2 max-w-2xl columns-1 sm:columns-2 [column-gap:0.25rem]'>
            {Object.keys(inputs.amenties).map((amenity, index) => (
                <label
                key={index}
                htmlFor={`amenities${index+1}`} 
                className='block mb-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer [break-inside:avoid]'
                >
                <input
                    type='checkbox'
                    id={`amenities${index+1}`}
                    className='mr-2 h-4 w-4 align-middle rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    checked={inputs.amenties[amenity]}
                    onChange={() =>
                    setInputs({
                        ...inputs,
                        amenties: { ...inputs.amenties, [amenity]: !inputs.amenties[amenity] }
                    })
                    }
                />
                <span className='align-middle text-gray-700'>{amenity}</span>
                </label>
            ))}
            </div>

                <button className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer'>Thêm Tour</button>
        </form>
  )
}

export default AddTour