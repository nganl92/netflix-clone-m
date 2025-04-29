import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { useContentStore } from '../store/content.js'
import {SMALL_IMG_BASIC_URL} from '../ultis/contant.js'
import { ChevronLeft,ChevronRight } from 'lucide-react'
const MovieSlider = ({category}) => {

    const { contentType } = useContentStore() 
    const [content, setContent] = useState([])
    const [showArrows, setShowArrows] = useState(false)
    const sliderRef = useRef(null)

    const formatedCategoryName = category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1) 
    const formattedContedType = contentType === "movie" ? "Movies" : "TV Shows"

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

    useEffect(() => {
        const getContent = async () => {
          try {
            // If the keys in tvController and movieController are different, the video cannot be retrieved.
            const res = await axios.get(`/api/v1/${contentType}/${category}`);
            // đảm bảo content là mảng
            setContent(Array.isArray(res.data.content) ? res.data.content : []);
          } catch (err) {
            console.error("Lỗi khi fetch dữ liệu:", err);
            setContent([]); // fallback khi có lỗi
          }
        };
        getContent();
      }, [category, contentType]);

    return (
        <div className="text-white bg-black relative px-5 md:px-20" 
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
        >
            <h2 className='text-2xl font-bold mb-4'>
                {formatedCategoryName} {formattedContedType}
            </h2>
            <div className="flex space-x-4 overflow-x-scroll scrollbar-hide movie" ref={sliderRef}>
                {content.map((item) => (
                    <Link to={`/watch/${item.id}`} className='min-w-[250px] relative group' key={item.id}> 
                    <div className="rounded-lg overflow-hidden">
                    <img src={SMALL_IMG_BASIC_URL + (item.poster_path || item.backdrop_path)} alt="Movie image" 
                        className='transition-transform duration-300 ease-in-out group-hover:scale-125'/>
                    </div>
                    <p className='mt-2 text-center'>{item.name || item.title}</p>
                    </Link>
                ))}
            </div>
            {showArrows && (
                <>
                    <button
                        className='absolute top-1/2 -translate-y-1/2 left-5 md:left-20 flex items-center justify-center size-12 rounded-full bg-opacity-50 hover:bg-red-400 text-white cursor-pointer z-10 bg-black'
                        onClick={scrollleft}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        className='absolute top-1/2 -translate-y-1/2 right-5 md:right-20 flex items-center justify-center size-12 rounded-full bg-opacity-50 hover:bg-red-400 text-white cursor-pointer z-10 bg-black'
                        onClick={scrollright}
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}
        </div>
  )
}

export default MovieSlider
