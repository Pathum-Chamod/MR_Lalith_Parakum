"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import Slider from './Slider';
import {glowEffect} from "@/helper/styles"


const HeroSection = () => {
  return (
    <div className='w-[100vw] bg-black'style={glowEffect}>
   <Slider  />
    </div>
  )
}

export default HeroSection