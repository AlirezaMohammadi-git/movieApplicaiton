import { useContext } from "react"
import starImage from '../assets/star.svg'
import noMovieImage from "../assets/no_movie.png"
import { MovieStateContext } from "../States"

export const MovieCard = () => {

    const { movie: { title, poster_path, vote_average, original_language, release_date } } = useContext(MovieStateContext);

    return (
        <div className="movie-card">
            <img
                src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : noMovieImage}
                alt=""
                onError={(e) => { e.target.onError = null /*Preventing infinite loop*/; e.target.src = noMovieImage }}
            />
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
    )
}