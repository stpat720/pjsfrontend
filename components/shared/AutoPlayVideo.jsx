import { useRef, useEffect } from "react";
import Video from "next-video";
import MediaThemeInstaplay from "player.style/instaplay/react";

export default function AutoPlayVideo({ src, aspectRatio }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl
              .play()
              .catch((error) => console.log("Autoplay blocked:", error));
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.5 } // Video plays when at least 50% visible
    );

    observer.observe(videoEl);
    return () => observer.unobserve(videoEl);
  }, []);

  return (
    <div
      className="w-full video-container"
      style={{
        aspectRatio,
        "--media-secondary-color": "#4a4a4a",
        // "--media-time-range-display": "none",
      }}
    >
      <Video
        ref={videoRef}
        src={
          src.startsWith("http") ? src : `https://stream.mux.com/${src}.m3u8`
        }
        theme={MediaThemeInstaplay}
        loop
        muted
        playsInline
        className="w-full h-full auto-hide-controls"
        style={{
          "--media-time-range-display": "none",
          "--media-control-display": "none",
        }}
      />
    </div>
  );
}
