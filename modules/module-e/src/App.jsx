import { useState, useEffect, useRef } from "react";

// Constants
import { images } from "./constants";

function App() {
  // console.log("OG Image", images);

  // States
  const [initialImage, setInitialImage] = useState(images);

  const [showUpload, setShowUpload] = useState(false);
  const [showCommandBar, setShowCommandBar] = useState(false);

  // Effects

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key.toLowerCase() === "k") || e.key === "/") {
        e.preventDefault(); // Prevent browser's default search behavior

        openDialog();
        document.body.style.overflow = "hidden";
      }

      if (e.key === "Escape") {
        closeDialog();
        console.log("Closed with Esc");
        document.body.style.overflow = "auto";
      }

      // Close command bar with Escape key
      // if (e.key === "Escape" && showCommandBar) {
      //   closeDialog();
      //   console.log("Closed with Esc");
      //   document.body.style.overflow = "auto";
      // }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCommandBar]);

  // Functions
  const convertImageName = (imagePath) => {
    // TODO: Not implemented

    /*
      The caption of the photos is defined by the filename. Please capitalize the remove slug of the filename. And the
caption doesn't contain a file extension.
For example, given a filename named "hello.jpg", the caption is Hello.
For example, the caption for "hello world.jpg" will be "Hello World".
For example, the caption for the "a-sample-photo.jpg" will be "A Sample Photo".
    */

    // Extract the file name from the full path/URL
    const filename = imagePath.split("/").pop().split("?")[0]; // remove query if exists

    // Remove the extension (like .jpg, .png)
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");

    // Replace dashes or underscores with space, then capitalize each word
    const words = nameWithoutExt.split(/[-_ ]+/).map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // Join the capitalized words
    return words.join(" ");
  };

  const onUploadImage = (e) => {
    const file = e.target.files[0];
    console.log("Uploaded file", file);

    if (file) {
      const url = URL.createObjectURL(file);
      setInitialImage((prev) => [...prev, url]);
      console.log("Image URL:", url);

      setShowUpload(false);
    }
  };

  const openDialog = () => {
    setShowCommandBar(true);
  };

  const closeDialog = () => {
    setShowCommandBar(false);
  };

  // Variable
  const commandBar = [
    {
      title: "Change to manual control mode",
      fn: () => {},
    },
    {
      title: "Change to auto-playing mode",
      fn: () => {},
    },
    {
      title: "Change to random playing mode",
      fn: () => {},
    },
    {
      title: "Switch to theme A",
      fn: () => {},
    },
    {
      title: "Switch to theme B",
      fn: () => {},
    },
    {
      title: "Switch to theme C",
      fn: () => {},
    },
    {
      title: "Switch to theme D",
      fn: () => {},
    },
    {
      title: "Switch to theme E",
      fn: () => {},
    },
    {
      title: "Switch to theme F",
      fn: () => {},
    },
  ];

  return (
    <main className="app">
      {/* Tools bar */}
      <div className="tools-bar-container">
        <button type="button" onClick={() => setShowUpload((prev) => !prev)}>
          {showUpload ? "Cancel Upload" : "Upload"}
        </button>
        <button>Setingg</button>
        <button>Full Screen</button>
      </div>

      {/* Implement Drag and Drop Zone */}

      {/* Panel Settings */}

      {/* Slideshow Component */}
      {showUpload ? (
        <div className="upload-container">
          <h2>Click here to upload image</h2>
          <p>or Drag and drop</p>

          <input
            type="file"
            name="upload-image"
            id="upload-image"
            accept="image/png, image/jpeg"
            onChange={onUploadImage}
          />
        </div>
      ) : (
        <div className="slideshow-container">
          {initialImage.map((item, index) => (
            <div key={item} className="slideshow-image-wrapper">
              <div className="slideshow-image">
                <img src={item} alt={convertImageName(item)} />
              </div>
              <p className="image-caption">{convertImageName(item)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Command Bar */}

      {showCommandBar ? (
        <div className="command-bar-container">
          <div className="command-bar" open={showCommandBar}>
            <h3>Command Bar</h3>

            <div className="command-bar-control">
              <input type="text" placeholder="Enter command...." />

              <div className="command-group">
                {commandBar.map((item) => (
                  <button key={item.title} onClick={item.fn}>
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default App;
