
import heroImage from './assets/hero.png'
import { SearchBox } from './components/Search.jsx'
import { useContext, useDeferredValue, useEffect, useState, useSyncExternalStore } from 'react'
import { Spinner } from './components/spinner.jsx'
import { MovieCard } from './components/MovieCard.jsx'
import { GlobalStateContext, MovieStateContext } from './States.jsx'
import { fetchMovies, getState, subscribe } from './Stores/MovieStore.js'

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

  const { movieList, errorMessage, isPending } = useSyncExternalStore(subscribe, getState)
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  //While these techniques are helpful in some cases, useDeferredValue is better suited to optimizing rendering because it is deeply integrated with React itself and adapts to the user's device. Unlike debouncing or throttling, it doesn't require choosing any fixed delay.

  useEffect(() => {
    fetchMovies(deferredSearchTerm)
  }, [deferredSearchTerm])

  return (
    <GlobalStateContext.Provider value={{ searchTerm, setSearchTerm, isPending, errorMessage, movieList }}>
      <Header />
      <AllMovies />
    </GlobalStateContext.Provider>
  )
}

export default App
