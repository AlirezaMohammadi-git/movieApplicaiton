
import heroImage from './assets/hero.png'
import { SearchBox } from './components/Search.jsx'
import { useContext, useDeferredValue, useState, useRef, useCallback, useEffect } from 'react'
import { Spinner } from './components/spinner.jsx'
import { MovieCard } from './components/MovieCard.jsx'
import { GlobalStateContext, MovieStateContext } from './States.jsx'
import { useQuery } from '@tanstack/react-query'
import createMovieQueryOptions from './data/queryOptions/MovieQueryOptions.js'
import { ErrorPage } from './components/ErrorPage.jsx'
import InfiniteScrollComponent from './test.jsx'

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

  const { deferredSearchTerm } = useContext(GlobalStateContext)
  const [movieList, setMovieList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const observerRef = useRef();
  const { data, isPending, isError, error } = useQuery(createMovieQueryOptions(deferredSearchTerm, currentPage || 1))

  useEffect(() => {
    setMovieList([]);
    setCurrentPage(1);
  }, [deferredSearchTerm]);


  useEffect(() => {
    if (data) {
      // using set to prevent douplicate items
      setMovieList(prev => [...new Set([...prev, ...data.results])])
      setTotalPages(data.total_pages)
    }
  }, [deferredSearchTerm, isPending, currentPage])

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
        {isPending ? <Spinner /> : null}
      </section >
  )
}

export const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  //While these techniques are helpful in some cases, useDeferredValue is better suited to optimizing rendering because it is deeply integrated with React itself and adapts to the user's device. Unlike debouncing or throttling, it doesn't require choosing any fixed delay.
  const deferredSearchTerm = useDeferredValue(searchTerm);
  // -- working with multiple queries : 
  // const [ {data} , result2 , result3 ] = useQueries(
  //   {
  //     queries : [
  //       createMovieQueryOptions(),
  //       createUserQueryOptions(),
  //       createAnimeQueryOptions(),
  //     ]
  //   }
  // )


  return (
    <GlobalStateContext.Provider value={
      {
        searchTerm,
        setSearchTerm,
        deferredSearchTerm
      }
    }>
      <Header />
      <AllMovies />
    </GlobalStateContext.Provider>
  )
}

export default App 
