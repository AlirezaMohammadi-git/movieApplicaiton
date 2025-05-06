import axios from "axios";



const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = localStorage.getItem("apiKey");
let controller;

// function to fetch movies and update the state (TanStack Query will handle everything for us now!)
export const fetchMovies = async ({ queryKey, signal }) => {

    const [_key, deferredSearchTerm, page] = queryKey;

    const endpoint = deferredSearchTerm
        ? `${BASE_URL}/search/movie?query=${encodeURIComponent(deferredSearchTerm)}&include_adult=false&page=${page}`
        : `${BASE_URL}/discover/movie?include_adult=false&include_video=true&language=en-US&page=${page}&sort_by=popularity.desc`;


    const axiosOptions = {
        method: "get",
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        },
        url: endpoint,
        responseType: "json",
        signal: signal
    }
    const response = await axios(axiosOptions);
    return await response.data;

}

export const testApiKey = async (apiKey) => {
    if (controller) {
        controller.abort();
    }
    if (apiKey === "") {
        return;
    }

    controller = new AbortController();

    const options = {
        method: "get",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${apiKey}`
        },
        responseType: "json",
        signal: controller.signal,
        url: "https://api.themoviedb.org/3/authentication"
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (err) {
        if (axios.isCancel(err) || err.name === "CanceledError") {
            console.log("Request cancelled:", err.message)
        } else {
            throw err;
        }
    }
    return null;
}
