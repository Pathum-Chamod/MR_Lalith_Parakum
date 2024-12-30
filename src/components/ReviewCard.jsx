import Image from "next/image";
import React from "react";

const ReviewCard = () => {
  return (
    <div className="flex flex-col items-center justify-center w-[150px] gap-3">
      {/* image contaionber */}
      <div className=" h-1/2 flex  items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="w-[100px] h-[100px] object-cover overflow-hidden rounded-full"
          width={100}
          height={100}
          alt="profile"
        />
      </div>
      {/* text container */}
      <div className="h-1/2 flex flex-col gap-3">
        <h3 className="text-lg text-white font-semibold text-center">Jhon Dowe</h3>
        <p className="text-gray-500 text-justify">Succssfull story in the Dancng with this teacher</p>
      </div>
    </div>
  );
};

export default ReviewCard;
