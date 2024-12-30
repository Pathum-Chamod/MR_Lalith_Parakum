import React from "react";

const Footer = () => {
  return (
    <div className="bg-black py-8">
      <div className=" max-w-[1280px] flex items-center mx-auto py-[20px]">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  items-center justify-between">
          <div className=" flex items-center justify-center">
          <div className="flex flex-col gap-2 ">
            <h3 className="text-[16px] text-white">List Title</h3>
            <ul className="text-sm text-gray-500 flex flex-col">
              <li>list item1</li>
              <li>list item1</li> 
              <li>list item1</li> 
              <li>list item1</li>
              <li>list item1</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 ">
            <h3 className="text-[16px] text-white">List Title</h3>
            <ul className="text-sm text-gray-500 flex flex-col">
              <li>list item1</li>
              <li>list item1</li> 
              <li>list item1</li> 
              <li>list item1</li>
              <li>list item1</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 ">
            <h3 className="text-[16px] text-white">List Title</h3>
            <ul className="text-sm text-gray-500 flex flex-col">
              <li>list item1</li>
              <li>list item1</li> 
              <li>list item1</li> 
              <li>list item1</li>
              <li>list item1</li>
            </ul>
          </div>
         
          <div className="flex flex-col gap-2 ">
            <h3 className="text-[16px] text-white">List Title</h3>
            <ul className="text-sm text-gray-500 flex flex-col">
              <li>list item1</li>
              <li>list item1</li> 
              <li>list item1</li> 
              <li>list item1</li>
              <li>list item1</li>
            </ul>
          </div>
          </div>
        </div>
      </div>
      <h3 className="text-sm text-gray-500  text-center">All Right received @ 2024</h3>
    </div>
  );
};

export default Footer;
