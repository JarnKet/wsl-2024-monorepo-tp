const ThemeB = ({
  initialImage,
  currentIndex,
  convertImageName,
  isTransitioning,
}) => (
  <div className="theme-b">
    <div
      className={`slideshow-image ${isTransitioning ? "transitioning" : ""}`}
    >
      <img
        src={initialImage[currentIndex]}
        alt={convertImageName(initialImage[currentIndex])}
      />
    </div>
    <p className={`image-caption ${isTransitioning ? "transitioning" : ""}`}>
      {convertImageName(initialImage[currentIndex])}
    </p>
  </div>
);

export default ThemeB;
