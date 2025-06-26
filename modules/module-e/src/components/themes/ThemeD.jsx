const ThemeD = ({
  initialImage,
  currentIndex,
  convertImageName,
  isTransitioning,
}) => {
  const getRotation = (index) => {
    const seed = index * 123456;
    return (seed % 11) - 5; // Random rotation between -5 and 5
  };

  return (
    <div className="theme-d">
      {initialImage.slice(0, currentIndex + 1).map((img, index) => (
        <div
          key={index}
          className={`photo-stack ${index === currentIndex ? "active" : ""}`}
          style={{
            transform: `rotate(${getRotation(index)}deg)`,
            zIndex: index,
          }}
        >
          <img src={img} alt={convertImageName(img)} />
          <div className="photo-caption">{convertImageName(img)}</div>
        </div>
      ))}
    </div>
  );
};

export default ThemeD;
