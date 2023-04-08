import { Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageSlider = ({ slides }) => {
  return (
    <Carousel infiniteLoop>
      {slides.map((slide, index) => {
        return (
          <Image
            src={slide.imageUrl ? slide.imageUrl : slide.image}
            key={index}
            height="65vh"
            // objectFit="cover"
            width="auto"
          />
        );
      })}
    </Carousel>
  );
};

export default ImageSlider;
