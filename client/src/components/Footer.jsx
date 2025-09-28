import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            
            <footer className="flex flex-col bg-neutral-400 border-gray-500 items-center justify-around w-full py-8 text-sm text-white">
                <img src={assets.logo} alt="Travel Tour logo"
                className="h-20 md:h-22 w-auto object-contain shrink-0"
                />
                <div className="flex items-center gap-8">
                    <a href="/" className="font-medium text-black hover:text-black transition-all">
                        Home
                    </a>
                    <a href="/about" className="font-medium text-black hover:text-black transition-all">
                        Giới thiệu
                    </a>
                    <a href="/datve" className="font-medium text-black hover:text-black transition-all">
                        Dịch vụ
                    </a>
                    <a href="#" className="font-medium text-black hover:text-black transition-all">
                        Liên hệ
                    </a>
                    <a href="#" className="font-medium text-black hover:text-black transition-all">
                        Trợ giúp
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/springh_m28/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram"
                        className="inline-flex hover:-translate-y-0.5 transition-transform duration-300"
                    >
                        <img
                        src="/instagram.svg"
                        alt="Instagram"
                        className="h-[50px] w-[50px] object-contain"
                        loading="lazy"
                        />
                    </a>

                    {/* Facebook */}
                    <a
                        href="https://www.facebook.com/DinXuanHoang/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Facebook"
                        className="inline-flex hover:-translate-y-0.5 transition-transform duration-300"
                    >
                        <img
                        src="/facebook.svg"
                        alt="Facebook"
                        className="h-[50px] w-[50px] object-contain"
                        loading="lazy"
                        />
                    </a>

                    {/* Zalo */}
                    <a
                        href="https://zalo.me/0768061573"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Zalo"
                        className="inline-flex hover:-translate-y-0.5 transition-transform duration-300"
                    >
                        <img
                        src="/zalo.svg"
                        alt="Zalo"
                        className="h-[50px] w-[50px] object-contain"
                        loading="lazy"
                        />
                    </a>

                    {/* GitHub */}
                    <a
                        href="https://github.com/XuanHoangMiracle"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="inline-flex hover:-translate-y-0.5 transition-transform duration-300"
                    >
                        <img
                        src="/github.svg"
                        alt="GitHub"
                        className="h-[30px] w-[30px] object-contain"
                        loading="lazy"
                        />
                    </a>
                </div>
                <p className="mt-8 text-black">Travel Tours 2025 </p>
            </footer>
        </>
  )
}

export default Footer