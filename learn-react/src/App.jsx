
import heroImage from './assets/hero.png'
import heroBackground from './assets/hero-bg.png'
import { SearchBox } from './components/Search.jsx'
import { useState } from 'react'

export const Header = () => {

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <img src={heroBackground} className='pattern' />

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

export const App = () => {
  return (
    <>
      <Header />
    </>
  )
}

export default App
