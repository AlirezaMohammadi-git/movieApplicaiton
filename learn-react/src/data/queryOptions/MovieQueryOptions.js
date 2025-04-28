import { queryOptions } from "@tanstack/react-query";
import { fetchMovies } from "../movie/MovieService.js"

export default function createMovieQueryOptions(deferredSearchTerm) {
    return queryOptions({
        // don't forgot to pass your input in queryKey's array!
        queryKey: ['movies', deferredSearchTerm],
        queryFn: () => fetchMovies(deferredSearchTerm)
    })
}



// youtube tutorial : https://www.youtube.com/watch?v=mPaCnwpFvZY