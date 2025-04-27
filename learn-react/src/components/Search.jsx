import React, { useContext } from "react"
import searchIcon from '../assets/search.svg'
import { GlobalStateContext } from "../States"

export const SearchBox = () => {

    const { searchTerm, setSearchTerm } = useContext(GlobalStateContext)
    // Don't change searchTerm itself,use setSearchTerm to change it (otherwise react will break!)
    // incorrect : searchTerm = "new value";
    // correct : setSearchTerm('new value')
    return (
        <div className="search">
            <div>
                <img src={searchIcon} alt="Search icon" />
                <input type="text" placeholder="Search Movie Name" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            </div>
        </div>
    )
}