import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ReviewCard from "./ReviewCard";
import CustomTitle from "./CustomTitle";

const SuccessStories = () => {
  return (
    <div className="bg-black py-8 h-[100vh] w-full flex items-center justify-center">
      <div className=" w-full max-w-[1280px] flex flex-col items-center mx-auto py-[20px]">
        <CustomTitle text="Successful Stories" />
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-[80vw] mt-5"
        >
          <CarouselContent>
            <CarouselItem className=" md:basis-1/2  lg:basis-1/4 flex items-center justify-center">
              <ReviewCard />
            </CarouselItem>
            <CarouselItem className=" md:basis-1/2  lg:basis-1/4  flex items-center justify-center">
              <ReviewCard />
            </CarouselItem>
            <CarouselItem className=" md:basis-1/2  lg:basis-1/4 flex items-center justify-center">
              <ReviewCard />
            </CarouselItem>
            <CarouselItem className=" md:basis-1/2  lg:basis-1/4 flex items-center justify-center">
              <ReviewCard />
            </CarouselItem>
            <CarouselItem className=" md:basis-1/2  lg:basis-1/4  flex items-center justify-center">
              <ReviewCard />
            </CarouselItem>
            <CarouselItem className=" md:basis-1/2  lg:basis-1/4  flex items-center justify-center">
              <ReviewCard />
            </CarouselItem>
            <CarouselItem className=" md:basis-1/2  lg:basis-1/4 flex items-center justify-center">
              <ReviewCard />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
     
      </div>
    </div>
  );
};

export default SuccessStories;
