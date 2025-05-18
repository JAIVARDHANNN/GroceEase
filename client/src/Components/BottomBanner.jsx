import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className="relative mt-20">
      <img
        src={assets.bottom_banner_image}
        alt="banner"
        className="w-full hidden md:block"
      />
      <img
        src={assets.bottom_banner_image_sm}
        alt="banner"
        className="w-full md:hidden"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center md:items-end pt-10 md:pt-0 md:pr-24">
        <div className=" backdrop-blur-sm p-4 md:p-6 rounded-lg w-[90%] md:w-[40%]">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-6 text-center md:text-right">
            Why We Are The Best?
          </h1>

          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 mt-4">
              <img
                src={feature.icon}
                alt={feature.title}
                className="md:w-11 w-9"
              />
              <div>
                <h3 className="text-lg md:text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-gray-500/70 text-xs md:text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BottomBanner
