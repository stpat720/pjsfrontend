"use client";

import { useState, useEffect, useMemo } from "react";
import Video from "next-video";
import "swiper/css"; // Swiper default styles
import "swiper/css/navigation"; // If using navigation buttons
import "swiper/css/pagination"; // If using pagination
import "../app/globals.css"; // Import global styles
import MySwiper from "./shared/MySwiper";
import AutoPlayVideo from "./shared/AutoPlayVideo";

const CATEGORY_OPTIONS = ["photography", "motion", "design", "3D_art"];

const Portfolio = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://pjsbackend.onrender.com/api/portfolio")
      .then((res) => res.text()) // Fetch XML as text
      .then((xmlText) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");

        // Extract portfolio items
        const items = [...xml.getElementsByTagName("item")].map((item) => ({
          title: item.getElementsByTagName("title")[0].textContent,
          description: item.getElementsByTagName("description")[0].textContent,
          media: JSON.parse(item.getElementsByTagName("media")[0].textContent), // Parse media as an array
          type: item.getElementsByTagName("type")[0].textContent.trim(), // "still" or "motion"
          aspectRatio:
            item.getElementsByTagName("aspect_ratio")[0]?.textContent || "16/9",
          category: [...item.getElementsByTagName("category")].map(
            (cat) => cat.textContent
          ),
          alt_category:
            [...item.getElementsByTagName("alt_category")].map(
              (cat) => cat.textContent
            ) || [],
        }));

        setItems(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching portfolio XML:", err);
        setLoading(false);
      });
  }, []);

  const toggleFilter = (category) => {
    setFilter((prevFilter) => (prevFilter === category ? "all" : category));
  };

  const filteredItems = useMemo(() => {
    return filter === "all"
      ? items
      : items.filter(
          (item) =>
            item.category.includes(filter) || item.alt_category.includes(filter)
        );
  }, [filter, items]);

  const getCategoryColor = (category) => {
    const categoryStr = String(category).toLowerCase(); // Ensure it's a string

    switch (categoryStr) {
      case "photography":
        return "bg-[#97c0d8] text-white hover:bg-[#76b6db] hover:text-white";
      case "design":
        return "bg-[#5e8b69] text-white hover:bg-[#4c915c] hover:text-white";
      case "3d_art":
        return "bg-[#e5b862] text-white hover:bg-[#e7ac3d] hover:text-white";
      case "motion":
        return "bg-[#f58e8e] text-white hover:bg-[#f67b7b] hover:text-white";
      default:
        return "bg-gray-300 text-black hover:bg-gray-400 hover:text-white";
    }
  };

  return (
    <div className="container mx-auto p-3 bg-white min-h-screen relative">
      {/* Filter Buttons */}
      <div className="flex space-x-5 sm:space-x-12 justify-center mt-1 mb-8 ">
        {CATEGORY_OPTIONS.map((category) => (
          <button
            key={category}
            className={`px-3 py-0 text-sm text-gray-600 rounded-full transition duration-200 ease-in-out ${
              filter === category
                ? `${getCategoryColor(category)} px-3 py-0 rounded-full`
                : "hover:bg-gray-300 hover:text-black"
            }`}
            onClick={() => toggleFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Logo & Contact Section */}
      <div className="grid grid-cols-12 gap-6 w-full items-center mt-[2rem] md:mt-[6rem] mb-10 md:mb-32 max-w-7xl mx-auto">
        <div className="hidden sm:block col-span-1 md:col-span-2"></div>{" "}
        {/* Left Spacing Column */}
        <div className="col-span-12 mt-[4rem] sm:col-span-10 md:col-span-8 flex justify-center">
          <div className="w-[20rem] h-auto" style={{ aspectRatio: 6 / 1 }}>
            <Video
              src={`https://stream.mux.com/b00g6b019xIbcDkfxb7ybIBMG6ZBWVCZ1x3W3JkAASbNw.m3u8`}
              controls={false}
              muted
              playsInline
              onLoadedMetadata={(e) => e.target.play()}
              className="w-full h-full"
            />
          </div>
          {/* <img src="https://pjsbackend.onrender.com/static/patrickjstephen.jpg" alt="Logo" className="w-56 h-auto" /> */}
        </div>
        <div className="col-span-1 md:hidden"></div> {/* Left Spacing Column */}
        <div className="hidden sm:block col-span-1 md:hidden"></div>{" "}
        {/* Left Spacing Column */}
        <div className="col-span-3 mt-[4rem] md:col-span-2 text-left flex flex-col mt-0">
          <p className="text-[0.7rem] text-gray-600">
            <a
              href="https://www.instagram.com/patrickjstephen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:underline"
            >
              @patrickjstephen
            </a>
          </p>
          <p className="text-[0.7rem] text-gray-600">
            patrickjstephen@gmail.com
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-600">Loading portfolio...</p>
      ) : (
        <div className="flex flex-col items-center space-y-12 md:space-y-24 max-w-7xl mx-auto">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-3 w-full items-start relative"
            >
              <div className="col-span-1 md:col-span-2"></div>{" "}
              {/* Left spacing column for balance */}
              <div className="col-span-10 md:col-span-8 flex justify-center relative items-start">
                <div className="relative w-full md:max-w-3xl">
                  {item.media.length > 1 ? ( // Use Swiper only if more than 1 media item
                    <div className="relative group">
                      <MySwiper item={item} />
                    </div>
                  ) : (
                    // Render normally if only one media item exists
                    <>
                      {item.type === "still" ? (
                        <img
                          src={item.media[0]}
                          alt={item.title}
                          className="w-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full"
                          style={{
                            aspectRatio: item.aspectRatio,
                            "--media-secondary-color": "#4a4a4a",
                          }}
                        >
                          <AutoPlayVideo
                            src={item.media[0]}
                            aspectRatio={item.aspectRatio}
                          />
                        </div>
                      )}
                    </>
                  )}
                  {/* Right vertical line */}
                  <div className="absolute right-[-18px] top-0 w-[2px] hidden xl:block bg-gray-300 h-[70px]"></div>

                  {/* CSS for auto-hiding video controls */}
                </div>
              </div>
              <div className=" col-span-1 md:hidden"></div>{" "}
              {/* Left Spacing Column */}
              <div className=" col-span-1 md:hidden"></div>{" "}
              {/* Left Spacing Column */}
              <div className="col-span-10 md:col-span-2 text-left flex flex-col justify-start relative">
                <div className="flex justify-between items-center gap-x-2 px-[-6] mb-0 md:mb-2">
                    <h2 className="md:hidden text-[0.8rem] text-gray-600 font-bold font-sans">{item.title}</h2>
                    <span
                      className={`inline-block py-1 rounded-full text-[0.8rem] font-regular font-sans
                        ${getCategoryColor(item.category)}`}
                      style={{
                        paddingLeft: "15px",
                        paddingRight: "15px",
                        paddingTop: "0px",
                        paddingBottom: "0px",
                        width: "fit-content",
                      }}
                    >
                      {item.category}
                    </span>
                    
                </div>
                <h2 className="hidden md:block px-3 text-[0.8rem] text-gray-600 font-bold font-sans">{item.title}</h2>
                <p className="px-0 md:px-3 text-xs text-gray-600 font-regular font-sans">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Footer Section */}
      <footer className="mt-24 py-8 bg-white-100 text-center">
        <div className="flex flex-col items-center">
          <img
            src="https://pjsbackend.onrender.com/static/patrickjstephen.jpg"
            alt="Patrick James Stephen Logo"
            className="w-32 h-auto mb-2"
          />
          <p className="text-sm text-gray-600">
            Patrick James Stephen, Copyright © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
