import React from 'react'
import Title from './Title'

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 bg-gray-900 text-white">
        <Title title='Đăng ký nhận những gì mới nhất' subTitle='Hãy đăng ký nhận bản tin của chúng tôi để không bỏ lỡ những thông tin mới nhất, ưu đãi độc quyền và nhiều bất ngờ.' />
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
                <input type="text" className="bg-white/20 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full" placeholder="Nhập Email của bạn" />
                <button type="button" className="inline-flex items-center justify-center cursor-pointer gap-4 group bg-black px-4 md:px-7 py-2.5 rounded active:scale-95 
                transition-all whitespace-nowrap w-auto [writing-mode:horizontal-tb]">Đăng ký
                <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" /></svg>
                </button>
            </div>
            <p className="text-gray-500 mt-6 text-xs text-center">Bằng cách đăng ký, bạn đồng ý với Chính sách Bảo mật của chúng tôi và đồng ý nhận các bản cập nhậts.</p>
        </div>
  )
}

export default NewsLetter