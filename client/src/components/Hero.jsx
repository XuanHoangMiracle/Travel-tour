import React from 'react'
import { assets, cities } from '../assets/assets';

const Hero = () => {
  // ---- added for custom suggestions (max 5 visible, scrollable) ----
  const [destination, setDestination] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState(0);

  const filtered = React.useMemo(() => {
    const q = destination.trim().toLowerCase();
    return q ? cities.filter(c => c.toLowerCase().includes(q)) : cities;
  }, [destination]);
  // -----------------------------------------------------------------

  return (
    <div className='flex flex-col items-start justify-center px-6
    md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/HeroImage.png")] 
    bg-no-repeat bg-cover bg-center h-screen'> 
        <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>Trải nghiệm du lịch tuyệt vời </p>
        <h1 className='font-playfair text-2xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>Điểm Đến Hoàn Hảo Dành Cho Bạn</h1>
        <p className='max-w-130 mt-2 text-sm md:text-base'>Khám phá những địa điểm du lịch tuyệt đẹp và trải nghiệm những dịch vụ tốt nhất cùng chúng tôi.</p>

         <form className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

            {/* --- Chọn điểm đến (giữ nguyên cấu trúc, thay datalist bằng dropdown cuộn) --- */}
            <div className='relative'>
                <div className='flex items-center gap-2'>
                    <img src={assets.location} alt="" className='h-4'/>
                    <label htmlFor="destinationInput">Chọn điểm đến</label>
                </div>

                <input
                  id="destinationInput"
                  type="text"
                  className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-64 md:w-45"
                  placeholder="Điểm đến của bạn"
                  required
                  autoComplete="off"
                  value={destination}
                  onChange={(e) => { setDestination(e.target.value); setOpen(true); setHighlight(0); }}
                  onFocus={() => setOpen(true)}
                  onBlur={() => setTimeout(() => setOpen(false), 120)} // cho phép click chọn trước khi đóng
                  onKeyDown={(e) => {
                    if (!open || filtered.length === 0) return;
                    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, filtered.length - 1)); }
                    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const pick = filtered[highlight];
                      if (pick) { setDestination(pick); setOpen(false); }
                    }
                  }}
                />

                {open && filtered.length > 0 && (
                  <ul
                    role="listbox"
                    className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-44 overflow-y-auto"
                  >
                    {filtered.map((city, idx) => (
                      <li
                        key={city + idx}
                        role="option"
                        aria-selected={idx === highlight}
                        className={`px-3 py-2 cursor-pointer select-none ${idx === highlight ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        onMouseDown={() => { setDestination(city); setOpen(false); }}
                        onMouseEnter={() => setHighlight(idx)}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Giữ nguyên thẻ datalist trong cấu trúc (không còn được input sử dụng) */}
                <datalist id='destinations'>
                    {cities.map((city,index)=>(
                        <option value={city} key={index}>{city}</option>
                    ))}
                </datalist>
            </div>

            <div>
                <div className='flex items-center gap-2'>
                     <img src={assets.calenderIcon} alt="" className='h-4'/>
                    <label htmlFor="checkIn">Ngày khởi hành</label>
                </div>
                <input id="checkIn" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div>
                <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="days">Số Ngày</label>
                <input min={1} max={30} id="days" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
            </div>
            </div>

            <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="guests">Số khách</label>
                <input min={1} max={20} id="guests" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
            </div>

            <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                 <img src={assets.searchIcon} alt="searchIcon" className='h-7'/>
                <span>Tìm kiếm</span>
            </button>
        </form>
    </div>
  )
}

export default Hero
