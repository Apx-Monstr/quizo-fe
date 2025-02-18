"use client"

import React, { useState, useEffect } from 'react';

const SLIDES = [
    {
      title: "Explore the Uncharted",
      desc: "Step into a world where knowledge is your galaxy. Every quiz is a new planet waiting to be discovered. Are you ready for liftoff?",
      img: "https://cdn.pixabay.com/photo/2023/08/17/09/22/planet-8196059_1280.png"
    },
    {
      title: "Unlock Your Potential",
      desc: "Every question is a key, every answer a step forward. Challenge your mind, learn something new, and level up with every quiz!",
      img: "https://images.pexels.com/photos/1148521/pexels-photo-1148521.jpeg"
    },
    {
      title: "Compete. Learn. Conquer.",
      desc: "Test your skills, challenge your friends, and rise to the top. The journey to mastery starts with a single question!",
      img: "https://plus.unsplash.com/premium_photo-1674163252735-63ae1262a71f?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
]
  


const SlideShow = () =>{
    const [currentSlide, setCurrentSlide] = useState(0);
  
    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 7500);

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };
    
    return (
        <div className="w-[calc(48%-40px)] bg-[#292137] rounded-xl text-white relative flex justify-between flex-col p-8 "
        style={{
            backgroundImage: `url(${SLIDES[currentSlide].img})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
            <div className="text-4xl audio uppercase">
                Quizo
            </div>
            <div className="">
                {SLIDES.map((slide, index) => (
                    <div
                        key={index}
                        className={`transition-opacity duration-1000 ease-in-out max-w-2xl
                        ${currentSlide === index ? '' : 'hidden '}`}
                    >
                        <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                        <p className="text-lg text-gray-200">{slide.desc}</p>
                    </div>
                ))}
                <div className="flex gap-2 justify-center pt-8 pb-4">
                    {SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-1 rounded transition-all duration-300 
                            ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SlideShow;