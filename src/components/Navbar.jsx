import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Character } from "./CharacterList";
import Modal from "./Modal";
function Navbar({ children }) {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src="/logo.svg" alt="" />
        <span>
          R&amp;M<b>.DB</b>
        </span>
      </div>
      {children}
    </nav>
  );
}

export default Navbar;

export function SearchResult({ children }) {
  return <div className="navbar-result">{children}</div>;
}

export function ShowResult({ numOfResult }) {
  return (
    <span>
      Found <strong>{numOfResult}</strong> Characters
    </span>
  );
}

export function Search({ query, setQuery }) {
  return (
    <label className="navbar__search">
      <span className="sr-only">Search characters by name</span>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="search"
        className="text-field"
        placeholder="Scan the multiverse..."
      />
    </label>
  );
}

export function Favourites({ favourite, onDeleteFavourite }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Modal onOpen={setIsOpen} open={isOpen} title="List of Favourites">
        {favourite.length === 0 && (
          <p className="modal__empty">No favourites saved yet.</p>
        )}
        {favourite.map((item) => (
          <Character key={item.id} item={item}>
            <button
              className="icon icon-btn red"
              onClick={() => onDeleteFavourite(item.id)}
              aria-label={`Remove ${item.name} from favourites`}
            >
              <TrashIcon />
            </button>
          </Character>
        ))}
      </Modal>
      <button
        className="heart"
        onClick={() => setIsOpen((is) => !is)}
        aria-label={`Open favourites (${favourite.length})`}
      >
        <HeartIcon className="icon" />
        <span className="badge">{favourite.length}</span>
      </button>
    </>
  );
}
