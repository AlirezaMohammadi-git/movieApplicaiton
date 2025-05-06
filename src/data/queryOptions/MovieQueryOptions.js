import { queryOptions } from "@tanstack/react-query";
import { fetchMovies, testApiKey } from "../movie/MovieService.js"

// each time deferredSearchTerm or page, update to new values, api will refetch!
export default function createMovieQueryOptions(deferredSearchTerm = "", page = 1) {
    return queryOptions({
        // don't forgot to pass your input in queryKey's array!
        queryKey: ['searchMovie', deferredSearchTerm, page],
        queryFn: fetchMovies,
        staleTime: 0,
        keepPreviousData: true,
    });
}


export function createTestApiKeyQueryOptions() {
    return {
        mutationFn: (apiKey) => testApiKey(apiKey),
        staleTime: 0,
        keepPreviousData: true
    }
}
