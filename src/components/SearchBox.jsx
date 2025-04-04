import { useEffect, useState } from "react";
import { IoIosCloseCircle, IoMdCheckmarkCircleOutline } from "react-icons/io";
import axios from "axios";

const YOUTUBE_API_KEY1 = import.meta.env.VITE_API_KEY1;
const YOUTUBE_API_KEY2 = import.meta.env.VITE_API_KEY2;
const YOUTUBE_API_KEY3 = import.meta.env.VITE_API_KEY3;
const YOUTUBE_API_KEY4 = import.meta.env.VITE_API_KEY4;
const YOUTUBE_API_KEY5 = import.meta.env.VITE_API_KEY5;

const apiKeys = [
  YOUTUBE_API_KEY1,
  YOUTUBE_API_KEY2,
  YOUTUBE_API_KEY3,
  YOUTUBE_API_KEY4,
  YOUTUBE_API_KEY5,
];

const getRandomApiKey = () => {
  const randomIndex = Math.floor(Math.random() * apiKeys.length);
  return apiKeys[randomIndex];
};

function SearchBox() {
  const [query, setQuery] = useState("");
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [videos, setVideos] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);

  const handleChannelClick = (channel) => {
    setQuery("");
    setChannels([]);
    if (
      selectedChannels.some(
        (selectedChannel) =>
          selectedChannel.id.channelId === channel.id.channelId,
      )
    ) {
      return;
    }
    setSelectedChannels((prev) => [...prev, channel]);
  };

  const fetchChannel = async () => {
    if (!query) {
      return;
    }
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            type: "channel",
            maxResults: 2,
            q: query,
            key: getRandomApiKey(),
          },
        },
      );
      return response.data.items;
    } catch (error) {
      console.log("Error in fetching search results", error);
    }
  };

  const fetchVideos = async () => {
    setError(false);
    setVideos([]);
    if (!keyword) {
      return;
    }
    setSearching(true);
    for (const channel of selectedChannels) {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              type: "video",
              channelId: channel.id.channelId,
              q: keyword,
              maxResults: 50,
              key: getRandomApiKey(),
            },
          },
        );
        const keywordWords = keyword.toLowerCase().split(/\s+/);
        const videos = response.data.items.filter((video) => {
          const titleWords = video.snippet.title.toLowerCase().split(/\s+/);
          return keywordWords.every((keywordWord) => {
            return titleWords.some((titleWord) =>
              titleWord.includes(keywordWord),
            );
          });
        });
        setVideos((prev) => [...prev, ...videos]);
      } catch (err) {
        console.log("Error in fetching videos", err);
        setError(true);
      }
    }
    setSearching(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChannel()
        .then((data) => {
          if (!data) return;
          setChannels(data);
        })
        .catch((err) => console.log(err));
    }, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const removeChannel = (id) => {
    const newSelectedChannels = selectedChannels.filter(
      (channel) => channel.id.channelId !== id,
    );
    setSelectedChannels(newSelectedChannels);
  };

  return (
    <div className="p-2 bg-gray-900 min-h-screen text-gray-200">
      <input
        className="block m-auto mt-8 w-90 sm:w-[60%] h-12 rounded-lg outline-none bg-gray-800 text-gray-200 px-4 py-2 placeholder-gray-400"
        type="text"
        placeholder={
          selectedChannels.length > 0
            ? "Add more channels..."
            : "Enter channel name here ..."
        }
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />

      {selectedChannels.length > 0 && (
        <div className="bg-gray-950 flex flex-wrap gap-1.5 items-center justify-center mx-auto mt-1 w-90 rounded-lg outline-none text-gray-200 px-2 py-2">
          {selectedChannels.map((channel) => (
            <div
              key={channel.id.channelId}
              className="bg-white inline-flex justify-center items-center rounded-md px-2 py-0.5"
            >
              <img
                className="inline-block rounded-full size-5"
                src={channel.snippet.thumbnails.default.url}
                alt=""
              />
              <span className="ml-2 text-xs text-gray-800">
                {channel.snippet.title}
              </span>
              <span
                className="ml-1 cursor-pointer"
                onClick={() => removeChannel(channel.id.channelId)}
              >
                <IoIosCloseCircle
                  style={{ color: "black", fontSize: "14px" }}
                />
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="relative w-90 sm:w-[60%] m-auto">
        <input
          disabled={selectedChannels.length === 0}
          className={`peer block m-auto mt-4 w-full h-12 rounded-lg outline-none px-4 py-2 ${
            selectedChannels
              ? "bg-gray-800 text-gray-200 placeholder-gray-400"
              : ""
          }`}
          type="text"
          id="keyword"
          value={keyword}
          placeholder="Enter video's title keyword here..."
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
        {keyword.length > 0 && (
          <label
            className="absolute block -top-2.5 left-4 px-2 py-0.5 shadow shadow-gray-500/30 text-xs rounded-lg bg-gray-800"
            htmlFor="keyword"
          >
            Keyword
          </label>
        )}
      </div>

      {query !== "" && channels.length > 0 && (
        <div className="absolute border max-h-80 top-50 left-1/2 -translate-x-1/2 overflow-scroll w-90 bg-gray-800 rounded-lg p-4 shadow-lg shadow-indigo-300/30">
          {channels.map((channel) => (
            <div
              key={channel.id.channelId}
              onClick={() => handleChannelClick(channel)}
              className="flex items-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-950 cursor-pointer transition mb-2"
            >
              <img
                className="size-12 rounded-full object-cover mr-4"
                src={channel.snippet.thumbnails.default.url}
                alt="Channel Logo"
              />

              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-semibold">
                  {channel.snippet.title}
                </h3>
                <p className="text-sm text-gray-400">-- Subscribers</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchVideos}
        className="block m-auto mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
      >
        Search Videos
      </button>

      {searching && (
        <div className="flex justify-center items-center mt-8">
          <div className="border-gray-300 size-14 animate-spin rounded-full border-8 border-t-indigo-700" />
        </div>
      )}

      <div className="mx-1 my-8 w-full md:flex md:flex-wrap md:gap-4 md:justify-center px-2 py-4 bg-gray-800 rounded-xl shadow-lg">
        {videos.length > 0 && (
          <div className="flex flex-col items-center justify-center w-full">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl md:text-4xl font-semibold px-8 py-4 rounded-xl shadow-xl flex items-center space-x-3 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <IoMdCheckmarkCircleOutline
                style={{ fontSize: "40px", color: "white" }}
              />
              <span className="font-bold">
                Found {videos.length} {videos.length === 1 ? "Video" : "Videos"}
              </span>
            </span>
          </div>
        )}

        {videos.length > 0 ? (
          videos.map((video) => (
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              key={video.id.videoId}
              className="flex items-start md:flex-col md:w-64 md: px-2 py-3 my-4 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              <img
                className="w-64 h-20 sm:w-80 sm:h-40 rounded-lg object-cover mr-4"
                src={video.snippet.thumbnails.high.url}
                alt="Video Thumbnail"
              />
              <div>
                <p className="text-sm font-medium sm:text-lg md:mt-2 text-gray-200 hover:underline">
                  {video.snippet.title}
                </p>
              </div>
            </a>
          ))
        ) : error === true ? (
          <p className="text-red-500 text-center">
            {videos?.length === 0 && "An Error Occurred! Try again"}
          </p>
        ) : (
          <p className="text-gray-400 text-center">
            {videos?.length === 0 && "No videos found!"}
          </p>
        )}
      </div>
    </div>
  );
}

export default SearchBox;
