import React, { useEffect, useState, useRef, useCallback } from 'react';
import noMovieImage from "./assets/no-movie.png"
import starImage from "./assets/star.svg"

function InfiniteScrollComponent() {

    let query = '';

    const BASE_URL = "https://api.themoviedb.org/3";
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_OPTIONS = {
        method: "GET",
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    }

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef();

    // Fetch data function
    const fetchData = async (page) => {
        const endpoint = query
            ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&page=${page}`
            : `${BASE_URL}/discover/movie?include_adult=false&include_video=true&language=en-US&page=${page}&sort_by=popularity.desc`;


        setLoading(true);
        try {
            const response = await fetch(endpoint, API_OPTIONS);
            const result = await response.json();


            Array.from(result.results).forEach(movie => {
                if (!data.includes(movie)) {
                    setData(prev => [...prev, movie]);
                }
            })
            if (data.includes())
                setTotalPages(result.total_pages);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    // Intersection Observer callback
    const lastItemRef = useCallback(node => {
        console.log("last item is visible")
        if (loading) return;

        // remove previous observer
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            // isIntersecting means if the element is visible on view port!
            if (entries[0].isIntersecting && currentPage < totalPages) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [loading, currentPage, totalPages]);

    return (
        <div>
            <h2>Data</h2>
            <ul>
                {data.map((item, index) => {
                    const isLastItem = index === data.length - 1;
                    const { title, poster_path, vote_average, original_language, release_date } = item;
                    return (
                        <li key={index} ref={isLastItem ? lastItemRef : null} style={{ margin: "0px 500px" }}>
                            <div className="movie-card">
                                <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : noMovieImage} alt="" />
                                <div className="mt-4" />
                                <h3>{title}</h3>
                                <div className="content">
                                    <div className="rating">
                                        <img src={starImage} alt="star" />
                                        <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
                                        <span>•</span>
                                        <p className="lang">{original_language}</p>
                                        <span>•</span>
                                        <p className="year">{release_date ? release_date.split('-')[0] : "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            {loading && <p>Loading more...</p>}
        </div >
    );
}

export default InfiniteScrollComponent;
