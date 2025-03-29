import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Video from "next-video";
import MediaThemeInstaplay from "player.style/instaplay/react";

function VideoSlide({ mediaSrc, aspectRatio, title, index }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play().catch((error) => console.log("Play error:", error));
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoEl);
    return () => {
      if (videoEl) observer.unobserve(videoEl);
    };
  }, []);

  return (
    <div
      className="w-full video-container"
      style={{ aspectRatio: aspectRatio, "--media-secondary-color": "#4a4a4a" }}
    >
      <Video
        ref={videoRef}
        src={`https://stream.mux.com/${mediaSrc}.m3u8`}
        theme={MediaThemeInstaplay}
        loop={true}
        muted={true}
        playsInline
        autoPlay={false}
        className="w-full h-full auto-hide-controls"
        style={{
          "--media-time-range-display": "none",
          "--media-control-display": "none",
        }}
      />
    </div>
  );
}

export default function MySwiper({ item }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative w-full group">
      <Swiper
        style={{ "--swiper-navigation-color": "#fff" }}
        modules={[Navigation, Pagination]}
        spaceBetween={2}
        slidesPerView={1}
        loop={true}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{
          clickable: true,
        }}
        lazyPreloadPrevNext={0}
        className="w-full overflow-visible"
        onSwiper={(swiper) => {
          setTimeout(() => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          });
        }}
      >
        {item.media.map((mediaSrc, idx) => {
          const isVideo =
            !mediaSrc.startsWith("http") &&
            !mediaSrc.endsWith(".jpg") &&
            !mediaSrc.endsWith(".png") &&
            !mediaSrc.endsWith(".jpeg");

          return (
            <SwiperSlide key={idx}>
              {isVideo ? (
                <VideoSlide
                  mediaSrc={mediaSrc}
                  aspectRatio={item.aspectRatio}
                  title={item.title}
                  index={idx}
                />
              ) : (
                <div
                  className="flex justify-center items-center w-full"
                  style={{ aspectRatio: item.aspectRatio }}
                >
                  <img
                    src={mediaSrc}
                    alt={item.title}
                    className="max-h-full object-contain"
                  />
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div
        ref={nextRef}
        className="absolute right-[-28px] top-1/2 -translate-y-1/2 flex items-center cursor-pointer"
      >
        <span className="text-gray-400 text-sm">{"❯"}</span>
      </div>
      <div
        ref={prevRef}
        className="absolute left-[-28px] top-1/2 -translate-y-1/2 flex items-center cursor-pointer"
      >
        <span className="text-gray-400 text-sm">{"❮"}</span>
      </div>

      {/* CSS to auto-hide video controls for a cleaner look */}
      <style jsx>{`
        .video-container video::-webkit-media-controls {
          opacity: 0;
          transition: opacity 0.5s;
        }
        .video-container:hover video::-webkit-media-controls {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
