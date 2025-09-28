import React from 'react'

const About = () => {
  return (
    <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            
            
            <div className="flex items-center gap-6 h-[400px] w-full max-w-5xl mt-40 mx-auto">
                <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="/Hop.png"
                        alt="image" />
                    <div
                        className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h1 className="text-3xl">LÀ LỰA CHỌN HÀNG ĐẦU</h1>
                        <p className="text-sm">Được hàng ngàn du khách tin tưởng lựa chọn mỗi năm,với lượt đánh giá hài lòng đạt 98%</p>
            
                    </div>
                </div>
                <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-right"
                        src="/Vanphong.png"
                        alt="image" />
                    <div
                        className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h1 className="text-3xl">QUY MÔ CHUYÊN NGHIỆP</h1>
                        <p className="text-sm">Có quy mô rộng và đội ngũ tư vấn chuyên nghiệp thân thiện</p>
            
                    </div>
                </div>
                <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="HoiAn.png"
                        alt="image" />
                    <div
                        className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h1 className="text-3xl">CHĂM SÓC KHÁCH HÀNG TỐT NHẤT</h1>
                        <p className="text-sm">Luôn đặt trải nghiệm của khách hàng lên hàng đầu</p>
            
                    </div>
                </div>
            </div>
        </>
  )
}

export default About