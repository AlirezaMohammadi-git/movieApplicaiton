import React from "react"
import searchIcon from '../assets/search.svg'

export const SearchBox = ({ searchTerm, setSearchTerm }) => {
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