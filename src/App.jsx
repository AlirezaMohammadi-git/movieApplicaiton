
import heroImage from './assets/hero.png'
import { SearchBox } from './components/Search.jsx'
import { useContext, useState, useRef, useCallback, useEffect } from 'react'
import { Spinner } from './components/spinner'
import { MovieCard } from './components/MovieCard.jsx'
import { GlobalStateContext, MovieStateContext } from './States.jsx'
import { useMutation, useQuery } from '@tanstack/react-query'
import createMovieQueryOptions, { createTestApiKeyQueryOptions } from './data/queryOptions/MovieQueryOptions.js'
import { ErrorPage } from './components/ErrorPage.jsx'
import { useDebounce } from 'use-debounce'

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

  const { searchTerm } = useContext(GlobalStateContext)
  const [debouncedSearch] = useDebounce(searchTerm, 500)
  const [movieList, setMovieList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const observerRef = useRef();
  const { data, isPending, isError, error } = useQuery(createMovieQueryOptions(debouncedSearch, currentPage || 1))
  useEffect(() => {
    setMovieList([]);
    setCurrentPage(1);
  }, [debouncedSearch]);


  useEffect(() => {
    if (data) {
      // using set to prevent douplicate items
      setMovieList(prev => [...new Set([...prev, ...data.results])])
      setTotalPages(data.total_pages)
    }
  }, [debouncedSearch, isPending, currentPage, data])

  // useCallback is similar to useEffect, but we can use it to access element like useRef! and each time one of it's depencendies changes, the callback will run!
  // combining useEffect and useRef => useCallback
  const lastItemRef = useCallback(node => {

    if (isPending) return;

    // remove previous observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      // isIntersecting means if the element is visible on view port!
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    }, { threshold: 1 });


    // if node changes (get visible for example) the callBack in IntersectionObserver will call.
    if (node) observerRef.current.observe(node);


  }, [isPending, currentPage, totalPages])

  return (
    isError ? <ErrorPage value={{ error }} /> :
      <section className='all-movies'>
        <h2>All Movies</h2>
        <ul style={{ overflowY: "auto", scrollBehavior: "smooth" }} >
          {movieList.map((movie, index) => {
            const isLastItem = index === movieList.length - 1;
            return (
              <li key={`${index}`} ref={isLastItem ? lastItemRef : null} >
                <MovieStateContext.Provider value={{ movie }}>
                  <MovieCard />
                </MovieStateContext.Provider>
              </li>
            )
          })}
        </ul>
        <Spinner opacity={isPending ? 100 : 0} />
      </section >
  )
}

const RequetsApiKey = () => {

  const [apiInput, setApiInput] = useState("");
  const [emptyInput, setEmptyInput] = useState(false);
  const [auth, setAuth] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const { mutate, data, isPending, isError, isSuccess, error } = useMutation(createTestApiKeyQueryOptions());

  useEffect(() => {
    if (isError && error?.response?.status === 401) {
      setAuth(true)
    }
  }, [isError, error])

  useEffect(() => {
    if (isPending) {
      setOpacity(100)
    } else {
      setOpacity(0)
    }
  }, [isPending])

  useEffect(() => {
    if (isSuccess) {
      if (data?.success === false) {
        setAuth(true);
      } else {
        setAuth(false);
        console.log("API Key is valid!");
        localStorage.setItem('apiKey', apiInput)
        window.location.reload();
      }
    }
  }, [isSuccess, data]);

  return (
    <>

      <div className='api-key'>
        <h1>Enter your API key</h1>
        <p className='text-center'>You can get your free api key from <a href='https://www.themoviedb.org/signup' target='_blanck'>TMDB website</a>.</p>
        <input type="text" placeholder='enter you api key here...' value={apiInput} onChange={(e) => { setApiInput(e.target.value) }} />
        <button onClick={() => {
          setAuth(false)
          if (apiInput.trim() === "") {
            setEmptyInput(true)
          } else {
            setEmptyInput(false);
            mutate(apiInput);
          }
        }} >Start</button>
        {isError && (error.response?.status !== 401) && <p className='text-red-500'>Error while athentication! Please try again later.</p>}
        {emptyInput && <p className='text-red-500'>input is empty!</p>}
        {auth && <p className='text-red-500'>Invalid API key: You must be granted a valid key.</p>}
        <Spinner opacity={opacity} />
      </div>

    </>
  )

}

export const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const apiKey = localStorage.getItem('apiKey')
  return (
    apiKey ? <GlobalStateContext.Provider value={
      {
        searchTerm,
        setSearchTerm,
      }
    }>
      <Header />
      <AllMovies />
    </GlobalStateContext.Provider> : <RequetsApiKey />
  )
}

export default App 
