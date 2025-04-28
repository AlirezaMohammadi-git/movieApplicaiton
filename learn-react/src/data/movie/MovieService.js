


const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}


// function to fetch movies and update the state (TanStack Query will handle everything for us now!)
export const fetchMovies = async (query = '') => {
    const endpoint = query
        ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
        : `${BASE_URL}/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc`;

    const response = await fetch(endpoint, API_OPTIONS);
    return await response.json();
}
