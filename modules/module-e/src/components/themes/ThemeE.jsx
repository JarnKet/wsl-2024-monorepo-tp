const ThemeE = ({
  initialImage,
  currentIndex,
  previousIndex,
  convertImageName,
  isTransitioning,
}) => (
  <div className="theme-e">
    <div className={`door-container ${isTransitioning ? "opening" : ""}`}>
      <div className="door-left">
        <img
          src={initialImage[previousIndex]}
          alt={convertImageName(initialImage[previousIndex])}
        />
      </div>
      <div className="door-right">
        <img
          src={initialImage[previousIndex]}
          alt={convertImageName(initialImage[previousIndex])}
        />
      </div>
    </div>
    <div className={`next-image ${isTransitioning ? "appearing" : ""}`}>
      <img
        src={initialImage[currentIndex]}
        alt={convertImageName(initialImage[currentIndex])}
      />
    </div>
  </div>
);

export default ThemeE;
