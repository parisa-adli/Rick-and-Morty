import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function CharacterList({ characters, onSelectCharacter, selectedId }) {
  return (
    <div className="characters-list">
      {characters.length === 0 && (
        <p className="empty">No life forms found in this dimension.</p>
      )}
      {characters.map((item) => (
        <Character
          key={item.id}
          item={item}
          onSelectCharacter={onSelectCharacter}
          selected={selectedId === item.id}
        >
          <button
            className="icon icon-btn"
            onClick={() => onSelectCharacter(item.id)}
            aria-label={`${selectedId === item.id ? "Hide" : "Show"} ${item.name} details`}
            aria-pressed={selectedId === item.id}
          >
            {selectedId === item.id ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </Character>
      ))}
    </div>
  );
}

export default CharacterList;

export function Character({ item, children, selected }) {
  return (
    <div className={`list__item ${selected ? "list__item--selected" : ""}`}>
      <img src={item.image} alt={item.name} loading="lazy" />
      <h3 className="name">
        <span>{item.gender === "Male" ? "👨" : "👱‍♀️"}</span>
        <span>{item.name}</span>
      </h3>
      <div className="list-item__info info">
        <span
          className={`status ${item.status === "Dead" ? "red" : ""}`}
        ></span>
        <span>&nbsp;{item.status}</span>
        <span> - {item.species}</span>
      </div>
      {children}
    </div>
  );
}
