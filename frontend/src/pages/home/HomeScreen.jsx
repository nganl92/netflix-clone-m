import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import { Play,Info } from 'lucide-react'
import useGetTrendingContent from '../../hooks/useGetTrendingContent.js'
import { SMALL_IMG_BASIC_URL, ORIGINAL_IMG_BASIC_URL, MOIVE_CATEGORIES, TV_CATEGORIES } from '../../ultis/contant.js'
import { useContentStore } from '../../store/content.js'
import MovieSlider from '../../components/MovieSlider.jsx'
export const HomeScreen = () => {

  const { trendingContent } = useGetTrendingContent()
  const { contentType } = useContentStore()  
  const [imgLoading, serImgLoading] = useState(true)
  if(!trendingContent) {
    return(
    <div className='h-screen text-white relative'>
        <Navbar />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer"></div>
    </div>
    )
  }

  return (
    <>
      <div className='relative h-screen text-white'>
        <Navbar />

        {/* Optimization  HACK FOR IMAHES*/}
        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer"></div>
        )}
        <img 
          src={ORIGINAL_IMG_BASIC_URL+trendingContent?.poster_path} 
          className='absolute top-0 left-0 w-full h-full object-cover -z-50' 
          alt="Hero img" 
          onLoad={()=> {
            serImgLoading(false)
          }}
        />

        <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-50" 
        aria-hidden="true"
        />
        
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:max-32">
          <div className="bg-gradient-to-b from-black via-trasparent to-transparent absolute w-full h-full top-0 left-0 -z-10"></div>
          <div className="max-w-2xl">
            <h1 className="mt-4 text-6xl font-extrabold text-balnce">{trendingContent?.title || trendingContent?.name} </h1>
            <p className="mt-2 text-lg">{
              trendingContent?.release_date?.split("-")[0] || 
              trendingContent?.first_air_date?.split("-")[0]}{" "} 
              | {trendingContent?.adult ? "18+" : "PG-13"}
              </p>
            <p className="mt-4 text-le">
            {
            trendingContent?.overview?.length > 200
              ? trendingContent?.overview.slice(0, 200) + "..."
              : trendingContent?.overview
  }
            </p>
          </div>
          <div className="flex mt-7">
            <Link to={`/watch/${trendingContent?.id}`}
              className='bg-white hover:bg-white/80 text-black font-fold py-2 px-4 rounded mr-4 flex items-center'
            >
              <Play className='size-6 inline-block mr-2 fill-black'/>
              Play
            </Link>

            <Link to={`/watch/${trendingContent?.id}`}
              className='bg-gray-500/70 hover:bg-gray-500 text-white font-fold py-2 px-4 rounded mr-4 flex items-center'
            >
              <Info className='size-6 inline-block mr-2'/>
              More Info
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10 bg-black py-10">
       
        {contentType === "movie" 
        ? (MOIVE_CATEGORIES.map((category) => <MovieSlider key={category} category={category}/>)) 
        : (TV_CATEGORIES.map((category) => <MovieSlider key={category} category={category}/>))}
      </div> 
    </>
  )
  
}
