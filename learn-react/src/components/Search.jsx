import React, { useContext, useRef } from "react"
import searchIcon from '../assets/search.svg'
import { GlobalStateContext } from "../States"

export const SearchBox = () => {

    const { searchTerm, setSearchTerm } = useContext(GlobalStateContext)
    const floatingSearch = useRef(null);
    const search = useRef(null)

    document.addEventListener('scrollend', () => {
        const cordinates = search.current.getBoundingClientRect();
        console.log()
        if (cordinates.bottom > 0) {
            floatingSearch.current.classList.remove('active')
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