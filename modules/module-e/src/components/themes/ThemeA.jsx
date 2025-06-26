const ThemeA = ({ initialImage, currentIndex, convertImageName }) => (
  <div className="theme-a">
    <div className="slideshow-image">
      <img
        src={initialImage[currentIndex]}
        alt={convertImageName(initialImage[currentIndex])}
      />
    </div>
    <p className="image-caption">
      {convertImageName(initialImage[currentIndex])}
    </p>
  </div>
);

export default ThemeA;
