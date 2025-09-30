import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <>
      {/* Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* (Option) Nếu bạn có Header/Banner dưới dạng component, bỏ comment 2 dòng này */}
      {/* <Header /> */}
      {/* <Banner /> */}

      {/* BAnner*/}
      <div className="flex items-center gap-6 h-[400px] w-full max-w-5xl mt-40 mx-auto">
        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img className="h-full w-full object-cover object-center" src="/Hop.png" alt="image" />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-3xl">LÀ LỰA CHỌN HÀNG ĐẦU</h1>
            <p className="text-sm">Được hàng ngàn du khách tin tưởng lựa chọn mỗi năm, với lượt đánh giá hài lòng đạt 98%</p>
          </div>
        </div>

        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img className="h-full w-full object-cover object-right" src="/Vanphong.png" alt="image" />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-3xl">QUY MÔ CHUYÊN NGHIỆP</h1>
            <p className="text-sm">Có quy mô rộng và đội ngũ tư vấn chuyên nghiệp thân thiện</p>
          </div>
        </div>

        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img className="h-full w-full object-cover object-center" src="/HoiAn.png" alt="image" />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-3xl">CHĂM SÓC KHÁCH HÀNG TỐT NHẤT</h1>
            <p className="text-sm">Luôn đặt trải nghiệm của khách hàng lên hàng đầu</p>
          </div>
        </div>
      </div>

      {/* ====== ABOUT AREA ====== */}
      <section className="py-24 relative z-[1]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col xl:flex-row justify-between">
            <div className="xl:w-1/4" data-aos="fade-right" data-aos-duration="1500" data-aos-offset="50">
              <img src="FaviconXH.png" alt="About" />
            </div>

            <div className="xl:w-3/4">
              <div className="about-page-content" data-aos="fade-left" data-aos-duration="1500" data-aos-offset="50">
                <div className="flex flex-wrap">
                  <div className="lg:w-2/3 pe-0 lg:pr-10 lg:mr-10">
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-4xl font-bold">
                        Công ty du lịch có kinh nghiệm tại Việt Nam
                      </h2>
                    </div>
                  </div>

                  <div className="md:w-1/3 w-full">
                    <div className="bg-blue-50 rounded-xl p-6 mb-5">
                      <span className="inline-block text-xs uppercase tracking-wider bg-blue-600 text-white px-3 py-1 rounded">
                        Năm kinh nghiệm
                      </span>
                      <div className="mt-2 text-gray-600">Chúng tôi có</div>
                      <div className="text-5xl font-extrabold text-blue-700">4+</div>
                    </div>
                  </div>

                  <div className="md:w-2/3 w-full">
                    <p className="text-gray-700 leading-relaxed">
                      Chúng tôi chuyên tạo ra những trải nghiệm thành phố khó quên cho du khách muốn khám phá trái tim và tâm hồn
                      của cảnh quan đô thị. Các tour du lịch có hướng dẫn viên chuyên nghiệp của chúng tôi sẽ đưa du khách qua
                      những con phố sôi động, các địa danh lịch sử và những viên ngọc ẩn giấu của mỗi thành phố.
                    </p>

                    <ul className="grid grid-cols-2 gap-3 mt-9 text-gray-800">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block" /> Trải nghiệm tốt nhất
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block" /> Đội ngũ Chuyên nghiệp
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block" /> Du lịch Chi phí Thấp
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block" /> Hỗ trợ Trực tuyến 24/7
                      </li>
                    </ul>

                    <Link
                      to="/tours"
                      className="inline-flex items-center gap-2 mt-7 px-5 py-2.5 rounded-lg bg-black text-white hover:bg-gray-900 transition"
                    >
                      <span>Khám phá Tours</span>
                      <i className="fal fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES (IMAGES + BOXES) ====== */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-wrap items-center gap-y-8">
            <div className="xl:w-1/3 md:w-1/2 w-full" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
              <img src="/about/about-feature1.png" alt="About" className="rounded-xl w-full h-auto" />
            </div>

            <div
              className="xl:w-1/3 md:w-1/2 w-full"
              data-aos="fade-up"
              data-aos-delay="50"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <img src="/about/about-feature2.png" alt="About" className="rounded-xl w-full h-auto" />
            </div>

            <div
              className="xl:w-1/3 md:w-2/3 w-full"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="flex flex-col gap-4">
                <div className="rounded-xl p-6 bg-blue-50">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl"><i className="flaticon-award-symbol" /></div>
                    <div>
                      <h5 className="font-semibold mb-4">
                        <p className='text-black font-bold bg-blue-400'>Chúng tôi là công ty tốt nhất về du lịch trong nước</p>
                      </h5>
                      <p className="text-gray-600">
                        Tại Travel Tours cam kết về sự xuất sắc và đổi mới đã đạt được
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-6 bg-indigo-600 text-white ml-auto w-fit">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl"><i className="flaticon-tourism" /></div>
                        <div>
                        <h5 className="font-semibold mb-1">
                            <a href="/tours" className="hover:underline">Hàng ngàn Điểm đến du lịch phổ biến</a>
                        </h5>
                        <p className="opacity-90">Mang đến trải nghiệm tốt nhất</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== ABOUT US (COUNTERS + IMAGE) ====== */}
      <section className="pt-16 pb-24 relative z-[1]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-wrap items-center">
            <div className="xl:w-5/12 lg:w-1/2 w-full order-2 lg:order-1">
              <div className="lg:pr-8" data-aos="fade-left" data-aos-duration="1500" data-aos-offset="50">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-4xl font-bold">
                    Du lịch với sự tự tin — Lý do hàng đầu để chọn công ty của chúng tôi
                  </h2>
                </div>
                <p className="text-gray-700">
                  Chúng tôi hợp tác chặt chẽ với khách hàng để hiểu rõ những thách thức và mục tiêu, cung cấp các giải pháp
                  tùy chỉnh để nâng cao hiệu quả, tăng lợi nhuận và thúc đẩy tăng trưởng bền vững.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="bg-gray-50 rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-blue-700" data-speed="2000" data-stop="1">1k+</div>
                    <div className="text-gray-600 mt-1">Điểm đến phổ biến</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-blue-700" data-speed="3000" data-stop="8">1m+</div>
                    <div className="text-gray-600 mt-1">Khách hàng hài lòng</div>
                  </div>
                </div>

                <Link
                  to="http://localhost:5173/tours"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  <span>Khám phá các điểm đến</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>

            <div className="xl:w-7/12 lg:w-1/2 w-full order-1 lg:order-2 mb-8 lg:mb-0" data-aos="fade-right" data-aos-duration="1500" data-aos-offset="50">
              <img src="/about/about-page.jpg" alt="About" className="rounded-2xl w-full h-auto shadow" />
            </div>
          </div>
        </div>
      </section>

      {/* ====== TEAM ====== */}
      <section className="pb-16 relative z-[1]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
            <h2 className="text-2xl md:text-4xl font-bold">Gặp gỡ nhà sáng lập của Travel Tours chúng tôi</h2>
            <p className="text-gray-600 mt-2">
              Website <span className="inline-block bg-indigo-600 text-white px-2 rounded" data-speed="3000" data-stop="34500">1M</span> trải nghiệm phổ biến nhất mà bạn sẽ nhớ
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <div className="xl:w-1/4 lg:w-1/3 sm:w-1/2 w-full" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
              <div className="rounded-2xl overflow-hidden group relative">
                <img src="/about/SpringHoang.jpg" alt="Guide" className="w-full h-[360px] object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h6 className="text-lg font-semibold">DINH XUAN HOANG</h6>
                  <div className="flex items-center gap-3 mt-2">
                    <a href="https://www.facebook.com/DinXuanHoang/" className="hover:text-blue-300"><i className="facebook" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== BENEFITS ====== */}
      <section className="bg-black text-white pt-24 pb-12 relative z-[1]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
            <h2 className="text-2xl md:text-4xl font-bold">Làm thế nào để nhận quyền lợi từ các chuyến du lịch của chúng tôi</h2>
            <p className="opacity-90 mt-2">
              Website <span className="inline-block bg-white text-black px-2 rounded" data-speed="3000" data-stop="34500">1M</span> Lượt truy cập
              — Trải nghiệm tốt nhất
            </p>
          </div>

          <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-6">
            <div className="rounded-2xl p-6 bg-white text-black" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
              <div className="text-3xl mb-3"><i className="flaticon-save-money" /></div>
              <h5 className="font-semibold mb-1"><Link to="/tours">Đảm bảo giá tốt nhất</Link></h5>
              <p className="text-gray-700">Cam kết giá ưu đãi nhất, giúp bạn tiết kiệm tối đa chi phí du lịch.</p>
            </div>

            <div className="rounded-2xl p-6 bg-neutral-900" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
              <div className="text-3xl mb-3"><i className="flaticon-travel-1" /></div>
              <h5 className="font-semibold mb-1"><Link to="/tours">Điểm đến đa dạng</Link></h5>
              <p className="opacity-80">Hàng nghìn điểm đến hấp dẫn, phù hợp mọi sở thích và phong cách du lịch.</p>
            </div>

            <div className="rounded-2xl p-6 bg-neutral-900" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500" data-aos-offset="50">
              <div className="text-3xl mb-3"><i className="flaticon-booking" /></div>
              <h5 className="font-semibold mb-1"><Link to="/tours">Đặt chỗ nhanh</Link></h5>
              <p className="opacity-80">Quy trình đặt chỗ đơn giản, nhanh chóng, đảm bảo chuyến đi suôn sẻ.</p>
            </div>

            <div className="rounded-2xl p-6 bg-neutral-900" data-aos="fade-up" data-aos-delay="150" data-aos-duration="1500" data-aos-offset="50">
              <div className="text-3xl mb-3"><i className="flaticon-guidepost" /></div>
              <h5 className="font-semibold mb-1"><Link to="/tours">Hướng dẫn du lịch tốt</Link></h5>
              <p className="opacity-80">Đội ngũ hướng dẫn tận tâm, giàu kinh nghiệm, đồng hành cùng bạn mọi hành trình.</p>
            </div>
          </div>
        </div>

        {/* shape */}
        <div className="absolute -bottom-6 right-4 opacity-60 pointer-events-none">
          <img src="/clients/assets/images/video/shape1.png" alt="shape" className="w-40 h-auto" />
        </div>
      </section>
    </>
  );
};

export default About;
