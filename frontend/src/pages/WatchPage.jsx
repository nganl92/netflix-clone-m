import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { useContentStore } from "../store/content"
import  Navbar  from '../components/Navbar'
import { ChevronLeft,ChevronRight, Loader } from "lucide-react"
import ReactPlayer from 'react-player'
import {ORIGINAL_IMG_BASIC_URL, SMALL_IMG_BASIC_URL} from '../ultis/contant.js'
import { formatRealeaseDate } from "../ultis/dateFunction.js"
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton"
import ScrollToTop from "../components/ScrollToTop.jsx"



const WatchPage =  () => {
    const { id } = useParams()
    const [trailers, setTrailers] = useState([])
    const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0)
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})
    const [similarContent, setSimilarContent] = useState({})
    const {contentType} = useContentStore()
    const sliderRef = useRef()
    const [showArrows, setShowArrows] = useState(false)

    useEffect(()=> {
        const getTrailers = async () => {
            try {
                const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`)
                setTrailers(res.data.trailers)
            } catch (error) {
                console.log('No trailers found')
            }
        }
        getTrailers()
    },[contentType,id])

    useEffect(()=> {
        const getSimilar = async () => {
            try {
                const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
                setSimilarContent(Array.isArray(res.data.similar) ? res.data.similar : []);
            } catch (error) {
                console.log(error)
                if (error.message.includes('404')) {
                    setSimilarContent([])
                }
            }
        }
        getSimilar()
    },[contentType,id])


    useEffect(()=> {
        const getContentDetails = async () => {
            try {
                const res = await axios.get(`/api/v1/${contentType}/${id}/details`)
                setContent(res.data.content)
            } catch (error) {
                if (error.message.includes('404')) {
                    setContent([])
                }
            } finally {
                setLoading(false)
            }
        }
        getContentDetails()
    },[contentType,id])

    const handlePrev = () => {
        if (currentTrailerIdx > 0) {
          setCurrentTrailerIdx(currentTrailerIdx - 1);
        }
      };
      
    const handleNext = () => {
        if (currentTrailerIdx < trailers.length - 1) {
          setCurrentTrailerIdx(currentTrailerIdx + 1);
        }
      };

    const scrollleft = () => {
        if(sliderRef.current) {
            sliderRef.current.scrollBy({left: -sliderRef.current.offsetWidth, behavior: 'smooth'})
        }
    }
    const scrollright = () => {
        if(sliderRef.current) {
            sliderRef.current.scrollBy({left: sliderRef.current.offsetWidth, behavior: 'smooth'})
        }
    }

    if(loading) return (
        <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
        </div>
    )
    
    return (
        <div className="bg-black min-h-screen text-white">
            <div className="mx-auto container px-4 py-8 h-full">
                <Navbar />

                {trailers.length > 0 && (
                    <div className="flex justify-between items-center mb-4">
                        <button className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded cursor-pointer
                            ${currentTrailerIdx === 0 ? "cursor-not-allowed opacity-50 " : ""}`}
                        disabled={currentTrailerIdx === 0}
                        onClick={handlePrev}
                        >
                            <ChevronLeft size={24} />
                     </button>

                     <button className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded
                        ${currentTrailerIdx === trailers.length - 1 ? "opacity-50 cursor-not-allowed " : ""}`}
                        disabled={currentTrailerIdx === trailers.length - 1}
                        onClick={handleNext}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )} 

                <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
                    {trailers.length > 0 && (
                       <ReactPlayer 
                            controls={true}
                            width={"100%"}
                            height={"70vh"}
                            className="mx-auto overflow-hidden rounded-lg"
                            url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
                       /> 
                    )}
                    
                    {trailers?.length === 0 && ( // có sẵn 
                      <h2 className="text-xl text-center mt-5">
                        No Trailers available for {" "}
                        <span className="font-bold text-red-600">{content?.name || content?.title}</span>😢
                      </h2>
                    )}
                </div>

                {/* movie detail*/}

                <div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto">
                    <div className="mt-4 md-0">
                        <h2 className="text-5xl font-bold text-valance">{content?.name || content?.title}</h2>

                        <p className="mt-2 text-ld">
                            {formatRealeaseDate(content?.release_date || content?.first_air_date)} || {" "}
                            {content?.adult ? (
                                <span className="text-red-600">18+</span>
                            ) : (
                                <span className="text-green-600">PG-13</span>
                            )}
                        </p>
                        <p className="mt-4 text-xl">
                            {content?.overview}
                        </p>
                    </div>
                    <img src={ORIGINAL_IMG_BASIC_URL + content.poster_path} alt="Poster image" 
                        className="max-h-[600px]"
                    />
                </div>

                {similarContent?.length > 0 && (
                   
                        
                    <div className="mt-12 max-w-6xl mx-auto relative"
                        onMouseEnter={() => setShowArrows(true)}
                        onMouseLeave={() => setShowArrows(false)}
                    >
                        <h3 className="text-3xl font-bold mb-4">
                            Similar Movie / Tv Shows
                        </h3>

                        <div className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group" ref={sliderRef}>
                            {similarContent.map((content) => {
                                if(content.poster_path === null) return null;
                                return (
                                    <Link key={content.id} to={`/watch/${content.id}`}
                                    className="w-52 flex-none"    
                                >
                                    <img className="w-full h-auto rounded-md " src={SMALL_IMG_BASIC_URL + content.poster_path} alt="Poster path" />
                                    <h4 className="mt-2 text-xl font-semibold">{
                                        (content.title?.length > 20 || content.name?.length > 20)
                                        ? `${(content.title || content.name).slice(0, 18)}...`
                                        : (content.title || content.name)
                                        }
                                    </h4>
                                </Link>
                                )
                                })}
                        </div>

                        {showArrows && (
                        <>
                            <button
                                className='absolute top-1/2 -translate-y-1/2 left-0 md:left-20 flex items-center justify-center size-12 rounded-full bg-opacity-50 hover:bg-red-600 text-white cursor-pointer z-10 bg-black'
                                onClick={scrollleft}
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <button
                                className='absolute top-1/2 -translate-y-1/2 right-2 md:right-20 flex items-center justify-center size-12 rounded-full bg-opacity-50 hover:bg-red-600 text-white cursor-pointer z-10 bg-black'
                                onClick={scrollright}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
            )}
                    </div>
                )}  
            </div>
        </div>
    )
}

export default WatchPage