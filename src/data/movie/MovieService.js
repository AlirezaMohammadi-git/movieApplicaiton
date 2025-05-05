import axios from "axios";



const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = localStorage.getItem("apiKey");
let controller;

// function to fetch movies and update the state (TanStack Query will handle everything for us now!)
export const fetchMovies = async (query = '', page = 1) => {


    if (controller) {
        controller.abort();
    }

    controller = new AbortController();

    const endpoint = query
        ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&page=${page}`
        : `${BASE_URL}/discover/movie?include_adult=false&include_video=true&language=en-US&page=${page}&sort_by=popularity.desc`;


    try {
        const API_OPTIONS = {
            method: "get",
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_KEY}`
            },
            url: endpoint,
            responseType: "json",
            signal: controller.signal
        }
        const response = await axios(API_OPTIONS);
        return await response.data;
    } catch (error) {
        if (axios.isCancel(error) || error.name === "CanceledError") {
            console.log("Request cancelled:", error.message)
        } else {
            throw error;
        }
    }
    return null;
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
