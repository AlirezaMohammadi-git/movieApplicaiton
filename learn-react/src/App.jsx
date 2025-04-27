
import heroImage from './assets/hero.png'
import { SearchBox } from './components/Search.jsx'
import { useContext, useEffect, useState, useTransition } from 'react'
import { Spinner } from './components/spinner.jsx'
import { MovieCard } from './components/MovieCard.jsx'
import { useDebounce } from 'use-debounce'
import { GlobalStateContext, MovieStateContext } from './States.jsx'

const Header = () => {

  const { searchTerm, setSearchTerm } = useContext(GlobalStateContext)

  return (
    <main>
      <div className='pattern' />

      <div className="wrapper">
        <header>
          <img src={heroImage} alt="Hero Image" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
        </header>

        <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

    </main>
  )
}

export const AllMovies = () => {

  const { isPending, movieList, errorMessage } = useContext(GlobalStateContext)

  return (
    <section className='all-movies'>
      <h2>All Movies</h2>
      {
        isPending ?
          (<Spinner />) :
          errorMessage ?
            (<p className='text-red-500'>{errorMessage}</p>) :
            (<ul>
              {movieList.map(movie => (
                <MovieStateContext.Provider key={movie.id} value={{ movie }}>
                  <MovieCard />
                </MovieStateContext.Provider>
              ))}
            </ul>)
      }

    </section>
  )
}

export const App = () => {

  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [movieList, setMovieList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm] = useDebounce(searchTerm, 1000);
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }

  async function fetchMovies(query = '') {

    const endpoint = query
      ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=true`
      : `${BASE_URL}/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc`;
    setErrorMessage('');

    startTransition(async () => {
      try {

        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
          throw new Error("failed to fetch data");
        }

        const data = await response.json();
        if (data.Response === "False") {
          setErrorMessage(data.error) || "Failed to load movies";
          setMovieList([])
          return;
        }

        setMovieList(Array.from(data.results))

      } catch (error) {
        setErrorMessage('Failed to Load movies. Please try again later!')
        console.log(`Error while fetching movies in App.jsx : ${error}`)
      }
    })

  }


  // below will run only one time! because of empty dependencies.
  useEffect(() => {
    fetchMovies(debounceSearchTerm)
  }, [debounceSearchTerm])

  return (
    <GlobalStateContext.Provider value={{ searchTerm, setSearchTerm, isPending, errorMessage, movieList }}>
      <Header />
      <AllMovies />
    </GlobalStateContext.Provider>
  )
}

export default App
