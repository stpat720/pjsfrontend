import { useEffect, useRef, useState } from "react";
import Video from "next-video";
import { useSwiperSlide, useSwiper } from "swiper/react";

const LazyVideo = ({ src, aspectRatio = "16/9", ...props }) => {
  const videoRef = useRef(null);
  const swiper = useSwiper();
  const swiperSlide = useSwiperSlide();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !swiper) return;

    const playVideo = () => {
      console.log("▶️ Playing:", src);
      video.play().catch(err => console.warn("Autoplay blocked:", err));
    };

    const pauseVideo = () => {
      console.log("⏸️ Pausing:", src);
      video.pause();
    };

    // ✅ Function to check if the video is actually visible
    const checkVisibility = () => {
      if (!isReady) return; // Wait until Swiper is initialized

      const rect = video.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      const isActiveSlide = swiper.activeIndex === swiperSlide.index;

      console.log(`📌 Video ${src} - Visible: ${isVisible}, Active Slide: ${isActiveSlide}`);

      if (isVisible && isActiveSlide) {
        playVideo();
      } else {
        pauseVideo();
      }
    };

    // ✅ Intersection Observer to detect visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isActiveSlide = swiper.activeIndex === swiperSlide.index;
          console.log(`👀 Intersection Observer: ${src} isIntersecting: ${entry.isIntersecting}, Active Slide: ${isActiveSlide}`);

          if (entry.isIntersecting && isActiveSlide) {
            playVideo();
          } else {
            pauseVideo();
          }
        });
      },
      { threshold: 0.6 } // 60% of the video must be visible to trigger
    );

    observer.observe(video.parentElement); // Observe the Swiper slide, not just the video

    // ✅ Swiper listener for slide changes
    const handleSlideChange = () => {
      console.log(`🔄 Swiper changed, checking visibility for: ${src}`);
      checkVisibility();
    };

    swiper.on("slideChange", handleSlideChange);

    // ✅ Ensure Swiper is initialized before checking visibility
    swiper.on("init", () => {
      console.log("✅ Swiper initialized, checking visibility...");
      setIsReady(true);
      checkVisibility();
    });

    // ✅ Run visibility check once Swiper is mounted
    if (swiper.initialized) {
      setIsReady(true);
      checkVisibility();
    }

    return () => {
      observer.disconnect();
      swiper.off("slideChange", handleSlideChange);
      swiper.off("init");
    };
  }, [swiper, swiperSlide.index, isReady]);

  return (
    <div className="w-full" style={{ aspectRatio }}>
      <Video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        {...props}
        className="w-full h-full"
      />
    </div>
  );
};

export default LazyVideo;
