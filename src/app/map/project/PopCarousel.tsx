'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';
// import {  useDotButton } from './CarouselDotButton';

export default function PopCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // const { selectedIndex, scrollSnaps, onDotButtonClick } =
  //   useDotButton(emblaApi);
  return (
    <div className='relative overflow-hidden' ref={emblaRef}>
      <div className='flex'>
        <div className='flex h-20 w-full flex-shrink-0 flex-grow-0 basis-full items-center justify-center bg-green-300'>
          Slide 1
        </div>
        <div className='flex h-20 w-full flex-shrink-0 flex-grow-0 basis-full items-center justify-center bg-green-300'>
          Slide 2
        </div>
        <div className='flex h-20 w-full flex-shrink-0 flex-grow-0 basis-full items-center justify-center bg-green-300'>
          Slide 3
        </div>
      </div>
      <button className='absolute left-0 top-[25%] z-10' onClick={scrollPrev}>
        <ChevronLeft />
      </button>
      <button className='absolute right-0 top-[25%] z-10' onClick={scrollNext}>
        <ChevronRight />
      </button>
      {/* <div className='embla__dots'>
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={'embla__dot'.concat(
              index === selectedIndex ? 'embla__dot--selected' : ''
            )}
          />
        ))}
      </div> */}
    </div>
  );
}
