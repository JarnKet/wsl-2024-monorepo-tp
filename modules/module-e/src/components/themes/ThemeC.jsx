const ThemeC = ({
  initialImage,
  currentIndex,
  convertImageName,
  isTransitioning,
}) => {
  const words = convertImageName(initialImage[currentIndex]).split(" ");
  return (
    <div className="theme-c">
      <div
        className={`slideshow-image ${isTransitioning ? "transitioning" : ""}`}
      >
        <img
          src={initialImage[currentIndex]}
          alt={convertImageName(initialImage[currentIndex])}
        />
      </div>
      <div className="caption-words">
        {words.map((word, index) => (
          <span
            key={`${currentIndex}-${index}`}
            className={`word ${isTransitioning ? "transitioning" : ""}`}
            style={{ animationDelay: `${index * 300}ms` }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ThemeC;
