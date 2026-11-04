import { useEffect, useRef, useState } from "react";
import "./App.css";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";
import Navbar, {
  SearchResult,
  ShowResult,
  Search,
  Favourites,
} from "./components/Navbar";
import Loader from "./components/Loader";
import { Toaster } from "react-hot-toast";
import useCharacters from "./hooks/useCharacters";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [query, setQuery] = useState("");
  const { isLoading, characters } = useCharacters(
    "https://rickandmortyapi.com/api/character?name=",
    query
  );
  const [selectedId, setSelectedId] = useState(null);
  const listRef = useRef(null);

  // bring results into view while searching; keyboard focus stays in the input
  useEffect(() => {
    if (query) listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [query]);
  const [favourite, setFavourite] = useLocalStorage("FAVOURITES", []);

  // const [count, setCount] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => setCount((c) => c + 1), 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [count]);

  //* clean up function
  // what?
  // why to use?
  // when run?
  // 1. unmount component
  // 2. befor the next re-render (between re-renders)
  // where to use?
  // effect => after unmount or while re-rendering
  // example :
  // fetch API, timer, eventListener,...

  // NOT TO FETCH IN THIS WAY :
  // fetch("https://rickandmortyapi.com/api/character")
  //   .then((res) => res.json())
  //   .then((data) => setCharacters(data.results));

  // fetch api, set timer, access to DOM, ...
  // effect : event handle function, useEffect

  // // first load - mount phase with then catch
  // useEffect(() => {
  //   setIsLoding(true);
  //   fetch("https://rickandmortyapi.com/api/character")
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Somthing went wrong!!");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setCharacters(data.results.slice(0, 4));
  //       // setIsLoding(false);
  //     })
  //     .catch((err) => {
  //       // setIsLoding(false);
  //       toast.error(err.message);
  //     })
  //     .finally(() => setIsLoding(false));
  // }, []);

  // // event side effect  with then catch
  // const handleLoadCharacter = () => {
  //   fetch("https://rickandmortyapi.com/api/character")
  //     .then((res) => res.json())
  //     .then((data) => setCharacters(data.results.slice(0, 3)));
  // };

  // first load - mount phase with async await
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoding(true);
  //       const res = await fetch("https://rickandmortyapi.com/api/character11");

  //       if (!res.ok) throw new Error("Somthing went wrong!");

  //       const data = await res.json();
  //       setCharacters(data.results.slice(0, 4));
  //       //setIsLoding(false);
  //     } catch (err) {
  //       //setIsLoding(false);
  //       console.log(err.message);
  //       toast.error(err.message);
  //     } finally {
  //       setIsLoding(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  // axios

  // dependency array ? rule => when to run effect function

  // 1. useEffect(()=>{}) --> on every render --> not control
  // 2. useEffect(()=>{},[]) --> on mount - first load(render)
  // 3. useEffect(()=>{},[state, props]) --> changes state or props

  // useEffect(()=>{
  // if(query)
  // }, [query]) --> when query changes(update) effect function run

  // when useEffect runs. ??

  // (1) state => changes -> re-render -> browser paint
  // (2) state => changes -> run effect function

  // event side effect with async await

  //?
  // const handleLoadCharacter = () => {
  //   async function fetchData() {
  //     const res = await fetch(
  //       `https://rickandmortyapi.com/api/character?name=${query}`
  //     );
  //     const data = await res.json();
  //     setCharacters(data.results.slice(0, 3));
  //   }
  //   fetchData();
  // };

  const handleSelectCharacter = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id)); // click on character is selected => on selecte
  };
  // console.log(selectedId);

  const handleAddFavourite = (char) => {
    setFavourite((prevFav) => [...prevFav, char]);
  };

  const isAddToFavourite = favourite.map((fav) => fav.id).includes(selectedId); // [1,2,3,...]

  const handleDeleteFvourite = (id) => {
    setFavourite((prevFav) => prevFav.filter((fav) => fav.id !== id));
  };

  return (
    <div className="app">
      {/* <div style={{ color: "#FFF", marginBottom: "50rem" }}>{count}</div> */}
      <Toaster
        toastOptions={{
          style: {
            background: "var(--glass-strong)",
            color: "var(--text)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(14px)",
          },
        }}
      />
      {/* <button onClick={handleLoadCharacter} className="load-characters-btn">
        load just first "3" characters
      </button> */}
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult>
          <ShowResult numOfResult={characters.length} />
        </SearchResult>
        <Favourites
          favourite={favourite}
          onDeleteFavourite={handleDeleteFvourite}
        />
      </Navbar>
      <Hero found={characters.length} favourites={favourite.length} />
      <div className="portal-divider" aria-hidden="true" />
      <Main>
        <section ref={listRef} className="main__section" aria-labelledby="subjects-title">
          <h2 id="subjects-title" className="section-title">
            Scanned Subjects
          </h2>
          {isLoading ? (
            <div className="characters-list">
              <Loader />
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="list__item skeleton" aria-hidden="true" />
              ))}
            </div>
          ) : (
            <CharacterList
              characters={characters}
              onSelectCharacter={handleSelectCharacter}
              selectedId={selectedId}
            />
          )}
        </section>
        <section aria-labelledby="dossier-title">
          <h2 id="dossier-title" className="section-title">
            Subject Dossier
          </h2>
          <CharacterDetail
            selectedId={selectedId}
            onAddFavourite={handleAddFavourite}
            isAddToFavourite={isAddToFavourite}
          />
        </section>
      </Main>
    </div>
  );
}
export default App;

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Hero({ found, favourites }) {
  // parallax: write pointer offset (-0.5..0.5) to CSS vars, no re-render
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", (e.clientX - r.left) / r.width - 0.5);
    e.currentTarget.style.setProperty("--my", (e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <header className="hero" onPointerMove={handleMove}>
      <div>
        <p className="hero__eyebrow">Dimension C-137 · Online</p>
        <h1 className="hero__title">
          Interdimensional
          <span>Character Database</span>
        </h1>
        <p className="hero__text">
          Scan the multiverse for every Rick, Morty and alien life form. Open a
          dossier, track their episodes and keep your favourites close.
        </p>
        <div className="hero__stats">
          <div className="stat">
            <strong>{found}</strong>
            <span>Subjects found</span>
          </div>
          <div className="stat">
            <strong>{favourites}</strong>
            <span>Favourites</span>
          </div>
        </div>
      </div>
      <div className="hero__visual" aria-hidden="true">
        <span className="planet planet--a" />
        <div className="portal">
          <span className="portal__swirl" />
          <span className="portal__streaks" />
          <div className="portal__core">
            <img src="https://rickandmortyapi.com/api/character/avatar/1.jpeg" alt="" />
          </div>
        </div>
        <span className="planet planet--b" />
      </div>
    </header>
  );
}
