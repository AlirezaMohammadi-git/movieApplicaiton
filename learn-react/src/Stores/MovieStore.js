


let state = { movieList: [], errorMessage: '', isPending: false } // initial state
let listeners = [] // list of subscribers
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}


// function to fetch movies and update the state
export const fetchMovies = async (query = '') => {

    state.isPending = true;

    const endpoint = query
        ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
        : `${BASE_URL}/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc`;
    try {
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
            throw new Error("failed to fetch data");
        }

        const data = await response.json();
        if (data.Response === "False") {
            state = { movieList: [], errorMessage: "Failed to load movies" }
            return;
        }

        state = { movieList: Array.from(data.results), errorMessage: "" }
        // nofifying all listiners:
        listeners.forEach(listener => listener());

    } catch (error) {
        state = { movieList: [], errorMessage: 'Failed to Load movies. Please try again later!' }
        console.log(`Error while fetching movies in App.jsx : ${error}`)
    } finally {
        state.isPending = false;
    }
}


// getter for state
export const getState = () => state;
// adding new subscriber
export const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
        //cleaning up
        listeners = listeners.filter((l) => l !== listener)
    }
}





//   async function fetchMovies(query = '') {

//     const endpoint = query
//       ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
//       : `${BASE_URL}/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc`;

//     setErrorMessage('');

//     startTransition(async () => {
//       try {

//         const response = await fetch(endpoint, API_OPTIONS);

//         if (!response.ok) {
//           throw new Error("failed to fetch data");
//         }

//         const data = await response.json();
//         if (data.Response === "False") {
//           setErrorMessage(data.error) || "Failed to load movies";
//           setMovieList([])
//           return;
//         }

//         setMovieList(Array.from(data.results))

//       } catch (error) {
//         setErrorMessage('Failed to Load movies. Please try again later!')
//         console.log(`Error while fetching movies in App.jsx : ${error}`)
//       }
//     })

//   }