import React, { useContext, useEffect, useRef } from "react"
import searchIcon from '../assets/search.svg'
import { GlobalStateContext } from "../States"

export const SearchBox = () => {

    const { searchTerm, setSearchTerm } = useContext(GlobalStateContext)
    const floatingSearch = useRef(null);
    const search = useRef(null)
    const observer = useRef()

    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                // main search bar is visible, so disabling floating search
                floatingSearch.current.classList.remove('active')
                search.focus();
                setTimeout(() => {
                    if (!floatingSearch.current.classList.contains('active')) {
                        floatingSearch.current.classList.add('invisible')
                    }
                }, 400);
            } else {
                floatingSearch.current.classList.remove('invisible')
                setTimeout(() => {
                    if (!floatingSearch.current.classList.contains('invisible')) {
                        floatingSearch.current.classList.add('active')
                    }
                }, 400)
            }
        })

        if (search) observer.current.observe(search.current)
    }, [])


    return (
        <>

            <div className="search-float invisible" ref={floatingSearch}>
                <div>
                    <img src={searchIcon} alt="Search icon" />
                    <input
                        type="text"
                        placeholder="Search Movie Name"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)} />
                </div>
            </div>


            <div className="search" ref={search}>
                <div>
                    <img src={searchIcon} alt="Search icon" />
                    <input
                        type="text"
                        placeholder="Search Movie Name"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)} />
                </div>
            </div>

        </>
    )
}