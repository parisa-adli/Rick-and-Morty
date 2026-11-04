import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { character, episodes } from "../../data/data";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import toast from "react-hot-toast";
import axios from "axios";

function CharacterDetail({ selectedId, onAddFavourite, isAddToFavourite }) {
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setCharacter(null); // if has error data => don't show previous character
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/${selectedId}`
        );
        setCharacter(data);

        const episodesId = data.episode.map((e) => e.split("/").at(-1)); // number of episode the character has been on ['1','2','10']
        const { data: episodesData } = await axios.get(
          `https://rickandmortyapi.com/api/episode/${episodesId}`
        );
        setEpisodes([episodesData].flat()); // flat -> [1,2,[3]] => [1,2,3]
      } catch (error) {
        toast.error(error.response.data.error);
      } finally {
        setIsLoading(false);
      }
    }
    if (selectedId) fetchData(); // dont' request to null address -> https://rickandmortyapi.com/api/character/null
  }, [selectedId]);

  if (isLoading)
    return (
      <div>
        <Loader />
        <div className="list__item skeleton" style={{ height: "18rem" }} />
      </div>
    );

  if (!character || !selectedId)
    return (
      <div className="detail-empty">
        <span className="detail-empty__portal" aria-hidden="true" />
        <p>Please select a character to open their dossier.</p>
      </div>
    );

  return (
    <div>
      <CharacterSubInfo
        character={character}
        onAddFavourite={onAddFavourite}
        isAddToFavourite={isAddToFavourite}
      />
      <EpisodeList episodes={episodes} />
    </div>
  );
}

export default CharacterDetail;

function CharacterSubInfo({ character, onAddFavourite, isAddToFavourite }) {
  return (
    <div className="character-detail">
      <img
        src={character.image}
        alt={character.name}
        className="character-detail__img"
      />
      <div className="character-detail__info">
        <h3 className="name">
          <span>{character.gender === "Male" ? "👨" : "👱‍♀️"}</span>
          <span>&nbsp;{character.name}</span>
        </h3>
        <div className="info">
          <span
            className={`status ${character.status === "Dead" ? "red" : ""}`}
          ></span>
          <span>&nbsp;{character.status}</span>
          <span>{character.species}</span>
        </div>
        <div className="location">
          <p>last known location</p>
          <p>{character.location.name}</p>
        </div>
        <div className="actions">
          {isAddToFavourite ? (
            <p>Already Added To Favorite ✅</p>
          ) : (
            <button
              onClick={() => onAddFavourite(character)}
              className="btn btn--primary"
            >
              Add to favourite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EpisodeList({ episodes }) {
  const [sortBy, setSortBy] = useState(true);

  let sortedEpisodes;

  if (sortBy) {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(a.created) - new Date(b.created)
    );
  } else {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  }

  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of Episodes:</h2>
        <button
          className="icon-btn"
          onClick={() => setSortBy((is) => !is)}
          aria-label={`Sort episodes ${sortBy ? "newest" : "oldest"} first`}
        >
          <ArrowUpCircleIcon
            className="icon"
            style={{ rotate: sortBy ? "0deg" : "180deg" }}
          />
        </button>
      </div>
      <ul>
        {sortedEpisodes.map((item, index) => (
          <li key={item.id} data-full-text={item.name}>
            <div>
              {String(index + 1).padStart(2, "0")} - {item.episode} :&nbsp;
              <strong>{item.name}</strong>
            </div>
            <div className="badge badge--secondary">{item.air_date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
