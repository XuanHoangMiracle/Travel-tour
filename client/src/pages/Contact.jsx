import React, { useState } from 'react';
// import Header from '../components/Header';
// import Banner from '../components/Banner';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    phone_number: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Bạn có thể đổi endpoint về đúng backend của bạn (VD: /api/create-contact)
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Demo submit – thay bằng API thật của bạn
      // await fetch('/api/create-contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      console.log('Contact payload:', form);
      alert('Gửi liên hệ thành công!');
      setForm({ name: '', phone_number: '', email: '', message: '' });
    } catch (err) {
      alert('Gửi thất bại, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* <Header /> */}
      {/* <Banner /> */}

      {/* Contact Info Area start */}
      <section className="pt-36 md:pt-44 lg:pt-48 relative z-[1]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-wrap items-center">
            {/* Left: intro */}
            <div className="lg:w-1/3 w-full">
              <div
                className="mb-8 lg:mb-0"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <div className="mb-6">
                  <h2 className="text-2xl md:text-4xl font-bold">
                    Hãy nói chuyện với các hướng dẫn viên du lịch chuyên nghiệp của chúng tôi
                  </h2>
                </div>
                <p className="text-gray-600">
                  Đội ngũ hỗ trợ tận tâm của chúng tôi luôn sẵn sàng hỗ trợ bạn giải đáp mọi thắc mắc hoặc vấn đề,
                  cung cấp các giải pháp nhanh chóng và được cá nhân hóa để đáp ứng nhu cầu của bạn.
                </p>

                <div className="mt-10">
                  <h6 className="font-semibold">85+ Thành viên nhóm chuyên gia</h6>
                  <div className="flex items-center gap-2 mt-3">
                    {[
                      'features/feature-author1.jpg',
                      'features/feature-author2.jpg',
                      'features/feature-author3.jpg',
                      'features/feature-author4.jpg',
                      'features/feature-author5.jpg',
                      'features/feature-author6.jpg',
                      'features/feature-author7.jpg',
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="Author"
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow"
                      />
                    ))}
                    <span className="ml-1 font-semibold">+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 4 info items */}
            <div className="lg:w-2/3 w-full">
              <div className="grid md:grid-cols-2 gap-5">
                {/* Email */}
                <div
                  className="rounded-xl border p-5 flex items-start gap-4"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                  data-aos-delay="50"
                >
                  <div className="text-xl mt-0.5"><i className="fas fa-envelope" /></div>
                  <div>
                    <h5 className="font-semibold">Cần trợ giúp và hỗ trợ</h5>
                    <div className="text-gray-600 flex items-center gap-2">
                      <i className="far fa-envelope" />
                      <a href="mailto:minhdien.dev@gmail.com" className="hover:underline">
                        Xuanhoangmk4@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div
                  className="rounded-xl border p-5 flex items-start gap-4"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                  data-aos-delay="100"
                >
                  <div className="text-xl mt-0.5"><i className="fas fa-phone" /></div>
                  <div>
                    <h5 className="font-semibold">Cần bất kỳ việc khẩn cấp nào</h5>
                    <div className="text-gray-600 flex items-center gap-2">
                      <i className="far fa-phone" />
                      <a href="tel:+0001234588" className="hover:underline">+84768061573</a>
                    </div>
                  </div>
                </div>

                {/* Address 1 */}
                <div
                  className="rounded-xl border p-5 flex items-start gap-4"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                  data-aos-delay="50"
                >
                  <div className="text-xl mt-0.5"><i className="fas fa-map-marker-alt" /></div>
                  <div>
                    <h5 className="font-semibold">Quảng Trị</h5>
                    <div className="text-gray-600 flex items-center gap-2">
                      <i className="fal fa-map-marker-alt" />
                      <span>Minh Hóa,Quảng Bình</span>
                    </div>
                  </div>
                </div>

                {/* Address 2 */}
                <div
                  className="rounded-xl border p-5 flex items-start gap-4"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                  data-aos-delay="100"
                >
                  <div className="text-xl mt-0.5"><i className="fas fa-map-marker-alt" /></div>
                  <div>
                    <h5 className="font-semibold">Kiến Trúc</h5>
                    <div className="text-gray-600 flex items-center gap-2">
                      <i className="fal fa-map-marker-alt" />
                      <span>129 Nguyễn Đức Thiệu,Cẩm Lệ,Đà Nẵng</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
      {/* Contact Info Area end */}

      {/* Contact Form Area start */}
      <section className="py-16 relative z-[1]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-wrap items-center">
            {/* Form */}
            <div className="lg:w-7/12 w-full">
              <div className="rounded-2xl border bg-gray-50 p-6" data-aos="fade-left" data-aos-duration="1500" data-aos-offset="50">
                <div className="mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold">Liên hệ</h2>
                </div>
                <p className="text-gray-600">
                  Địa chỉ email của bạn sẽ không được công bố. Các trường bắt buộc được đánh dấu <span className="text-red-500">*</span>
                </p>

                <form className="mt-8" onSubmit={onSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium">Họ và tên <span className="text-red-500">*</span></label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Họ và tên"
                        value={form.name}
                        onChange={onChange}
                        className="mt-1.5 w-full h-11 rounded-lg border border-gray-300 px-3 outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium">Số điện thoại <span className="text-red-500">*</span></label>
                      <input
                        id="phone_number"
                        name="phone_number"
                        type="text"
                        required
                        placeholder="Số điện thoại"
                        value={form.phone_number}
                        onChange={onChange}
                        className="mt-1.5 w-full h-11 rounded-lg border border-gray-300 px-3 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium">Địa chỉ Email <span className="text-red-500">*</span></label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Nhập email"
                        value={form.email}
                        onChange={onChange}
                        className="mt-1.5 w-full h-11 rounded-lg border border-gray-300 px-3 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="message" className="block text-sm font-medium">Nội dung <span className="text-red-500">*</span></label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        placeholder="Nội dung"
                        value={form.message}
                        onChange={onChange}
                        className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-6 h-11 hover:bg-gray-900 active:scale-95 transition disabled:opacity-60"
                    >
                      <span>Gửi</span>
                      <i className="fal fa-arrow-right" />
                    </button>
                    <div id="msgSubmit" className="hidden" />
                  </div>
                </form>
              </div>
            </div>

            {/* features */}
            <div className="lg:w-5/12 w-full mt-10 lg:mt-0">
              <div data-aos="fade-right" data-aos-duration="1500" data-aos-offset="50" className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <img
                      src="contact/contact1.jpg"
                      alt="Contact"
                      className="rounded-2xl w-full h-[260px] object-cover shadow"
                    />
                  </div>
                  <div>
                    <img
                      src="contact/contact2.jpg"
                      alt="Contact"
                      className="rounded-2xl w-full h-[180px] object-cover shadow"
                    />
                  </div>
                  <div>
                    <img
                      src="contact/contact3.jpg"
                      alt="Contact"
                      className="rounded-2xl w-full h-[180px] object-cover shadow"
                    />
                  </div>
                </div>

                {/* circle logo */}
                <div className="absolute -bottom-6 -right-3 bg-white rounded-full px-4 py-2 shadow flex items-center gap-2">
                  <img src="FaviconXH.png" alt="Logo" className="h-8 w-8" />
                  <span className="text-xl font-bold">Travel</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* Contact Form Area end */}

      {/* Contact Map Start */}
      <div className="w-full">
        <iframe
          title="Da Nang map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61349.64701146602!2d108.16542067386848!3d16.047164798501537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a13%3A0xfc14e3a044436487!2sDa%20Nang%2C%20H%E1%BA%A3i%20Ch%C3%A2u%20District%2C%20Da%20Nang%2C%20Vietnam!5e0!3m2!1sen!2s!4v1729087157388!5m2!1sen!2s"
          style={{ border: 0, width: '100%', height: 420 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {/* Contact Map End */}

      {/* <Footer /> */}
    </>
  );
};

export default Contact;
