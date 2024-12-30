import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'

const AchievemtCards = () => {
  return (
    <div className="flex flex-col w-[300px]  items-center my-[25px] gap-4">
    <div className="w-full flex flex-col  gap-3 items-center justify-center">
      {/* images */}

      <Image
        src="https://images.unsplash.com/photo-1519689157479-930721ed8836?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        width={100}
        height={100}
        alt="profile"
        className="w-full h-full  rounded-lg"
      />
    </div>
    {/* text */}
    <div className="w-full flex gap-4 flex-col justify-center items-center">
      <h3 className='text-white font-semibold'>Title of the Achievement</h3>
      <p className="text-gray-400 text-justify text-sm">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        Temporibus, voluptate eos perferendis repellat velit iusto
        labore! Laudantium consectetur molestiae nostrum magnam deleniti
        architecto dignissimos voluptatum. Optio sunt a repudiandae
        exercitationem!
      </p>
      <Button variant="gradient_bg">View More</Button>
    </div>
  </div>  )
}

export default AchievemtCards