"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { glowEffect } from "@/helper/styles";

const data =[
    {
        id:1,
        title : "Title One on the display",
        subTitle : "test site current slide ",
        image: "https://images.unsplash.com/photo-1519925610903-381054cc2a1c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id:2,
        title : "Title Two on the display",
        subTitle : "test site current slide ",
        image: "https://plus.unsplash.com/premium_photo-1685094987286-fa4ce5edd55c?q=80&w=2968&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
    ,
    {
        id:3,
        title : "Title three on the display",
        subTitle : "test site current slide ",
        image: "https://images.unsplash.com/photo-1519689157479-930721ed8836?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
]



const Slider = () => {
const [currentSlide, setCurrentSlide] = useState(0)


useEffect(() => {
  const interval = setInterval(()=>{
setCurrentSlide(prev=> prev === data.length-1 ? 0 : prev +1 )
  },2000)
  return () => clearInterval(interval)
}, [])
console.log(currentSlide, "current slide")
  return (
    <div className="w-full h-[calc(100vh-80px)]  flex items-center justify-between">
      {/* text */}
      <div className=" w-1/2 h-full flex flex-col items-center justify-center gap-7 px-12 relative ">
        <h1 className="text-[40px] text-center font-bold text-white">
          {data[currentSlide]?.title}
        </h1>
        <div className="w-[60px] absolute top-5 left-4" style={glowEffect}>

        </div>
        <div className="w-[60px] absolute bottom-4 right-5" style={glowEffect}>

</div>
<div className="w-[60px] absolute top-[100px] left-250px]" style={glowEffect}>

</div>
        <p className="text-gray-400 text-lg">
       {data[currentSlide]?.subTitle}
        </p>
        <Button variant="gradient_bg">Connect With Us</Button>
      </div>
      {/* image */}
      <div className="w-1/2 h-full">
        <Image
          src={
            data[currentSlide]?.image
          }
          width={100}
          height={100}
          className="w-full h-full"
          alt="image"
        />
      </div>
    </div>
  );
};

export default Slider;
