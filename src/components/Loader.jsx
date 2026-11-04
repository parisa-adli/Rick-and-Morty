function Loader() {
  return (
    <div className="loader" role="status">
      <span className="loader__ring" aria-hidden="true" />
      <p>Scanning the multiverse...</p>
    </div>
  );
}

export default Loader;
