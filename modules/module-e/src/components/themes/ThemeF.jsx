const ThemeF = ({
  initialImage,
  currentIndex,
  isTransitioning,
  convertImageName,
}) => {
  return (
    <div className="theme-f">
      <div
        className={`slideshow-image ${isTransitioning ? "transitioning" : ""}`}
      >
        <img
          src={initialImage[currentIndex]}
          alt={convertImageName(initialImage[currentIndex])}
        />
        <div className="image-overlay"></div>
      </div>
      <div
        className={`floating-caption ${isTransitioning ? "transitioning" : ""}`}
      >
        {convertImageName(initialImage[currentIndex])
          .split("")
          .map((char, index) => (
            <span
              key={`${currentIndex}-${index}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
      </div>
    </div>
  );
};

export default ThemeF;
