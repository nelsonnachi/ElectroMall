import React, { useState } from 'react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Banner = () => {
  // Keeps track of which slide is currently active (0, 1, or 2)
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 1,
      bgGradient: 'from-slate-900 to-blue-950',
      badge: 'Next-Gen Audio',
      title: 'Sound Without Boundaries',
      text: 'Immersive headphones with active noise cancellation and 60-hour battery life.',
      cta: 'Shop Audio Tech',
      glowColor: 'bg-cyan-400'
    },
    {
      id: 2,
      bgGradient: 'from-slate-900 to-emerald-950',
      badge: 'Flagship Mobile',
      title: 'Power Meets Precision',
      text: 'Experience maximum performance with the all-new high-speed processor chip.',
      cta: 'Order Smartphone',
      glowColor: 'bg-emerald-400'
    },
    {
      id: 3,
      bgGradient: 'from-slate-900 to-purple-950',
      badge: 'Gaming Rig',
      title: 'Dominate The Arena',
      text: 'Eliminate lagging bottlenecks with a liquid-cooled graphics card matrix.',
      cta: 'Upgrade Rig',
      glowColor: 'bg-fuchsia-400'
    }
  ];

  return (
    <div className="w-full bg-black">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        loop={true}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        className="w-full h-87.5"
        // Updates the active slide index state whenever the slide changes
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((slide, index) => {
          // Checks if this specific slide is the active one
          const isActive = activeIndex === index;

          return (
            <SwiperSlide 
              key={slide.id} 
              className={`w-full h-full bg-linear-to-r ${slide.bgGradient} relative`}
            >
              
              {/* Main Container Layout */}
              <div className="w-full h-full container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
                
                {/* Left Column: Text & Content */}
                <div className="text-left">
                  
                  {/* Badge Tag */}
                  <span className={`inline-block bg-white/10 text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4 transition-all duration-500 delay-100 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    {slide.badge}
                  </span>
                  
                  {/* Big Bold Title */}
                  <h1 className={`text-white text-4xl sm:text-5xl font-black mb-4 transition-all duration-500 delay-200 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    {slide.title}
                  </h1>
                  
                  {/* Description Paragraph */}
                  <p className={`text-slate-300 text-base sm:text-lg mb-6 max-w-md transition-all duration-500 delay-300 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    {slide.text}
                  </p>
                  
                  {/* Call-to-Action Button */}
                  <div className={`transition-all duration-500 delay-400 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <button className="bg-white text-black font-bold px-6 py-3 rounded-md text-sm uppercase tracking-wider hover:bg-slate-100 transition-all">
                      {slide.cta}
                    </button>
                  </div>

                </div>

                {/* Right Column: Abstract Graphics (Hidden on Mobile) */}
                <div className="hidden lg:flex justify-center items-center">
                  
                  {/* Graphic Shape Wrapper */}
                  <div className={`w-64 h-64 relative flex items-center justify-center transition-all duration-700 delay-200 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  }`}>
                    
                    {/* Glowing Accent Blur */}
                    <div className={`absolute inset-0 rounded-full ${slide.glowColor} opacity-10 blur-xl animate-pulse`} />
                    
                    {/* Spinning Circuit Framework */}
                    <div className="absolute w-56 h-56 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md animate-[spin_25s_linear_infinite]" />
                    
                    {/* Central Electronic Processing Chip Core */}
                    <div className={`w-16 h-16 rounded-xl ${slide.glowColor} shadow-lg animate-pulse flex items-center justify-center`}>
                      <div className="w-4 h-4 bg-black rounded-full" />
                    </div>

                  </div>

                </div>

              </div>

            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Banner;
