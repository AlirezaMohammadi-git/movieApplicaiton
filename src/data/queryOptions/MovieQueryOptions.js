import { queryOptions } from "@tanstack/react-query";
import { fetchMovies, testApiKey } from "../movie/MovieService.js"

// each time deferredSearchTerm or page, update to new values, api will refetch!
export default function createMovieQueryOptions(deferredSearchTerm = "", page = 1) {
    return queryOptions({
        // don't forgot to pass your input in queryKey's array!
        queryKey: ['movies', deferredSearchTerm, page],
        queryFn: () => fetchMovies(deferredSearchTerm, page),
    })
}


export function createTestApiKeyQueryOptions() {
    return {
        // don't forgot to pass your input in queryKey's array!
        mutationFn: (apiKey) => testApiKey(apiKey),
    }
}

// youtube tutorial : https://www.youtube.com/watch?v=mPaCnwpFvZY