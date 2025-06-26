import { useState, useEffect, useRef } from "react";

// Constants
import { images, OperationModes } from "./constants";

function App() {
  // Ref
  const intervalRef = useRef(null);
  const slideshowRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // States
  const [initialImage, setInitialImage] = useState(images);
  const [searchCommand, setSearchCommand] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [operationMode, setOperationMode] = useState(OperationModes.MANUAL);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showState, setShowState] = useState("carousel"); // carousel, upload, setting
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCommandBar]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (operationMode === OperationModes.MANUAL) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          goToNext();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          goToPrev();
        }
      }

      return;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [operationMode]);

  // --- Operation Logic ---
  useEffect(() => {
    // Clean up interval if mode changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (operationMode === OperationModes.AUTO) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % initialImage.length);
      }, 3000);
    }

    if (operationMode === OperationModes.RANDOM) {
      intervalRef.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * initialImage.length);
        setCurrentIndex(randomIndex);
      }, 3000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [operationMode, initialImage.length]);

  // Functions

  const convertImageName = (path) => {
    const filename = path.split("/").pop().split("?")[0];
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    return nameWithoutExt
      .split(/[-_ ]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const onUploadImage = (e) => {
    const file = e.target.files[0];
    console.log("Uploaded file", file);

    if (file) {
      const url = URL.createObjectURL(file);
      setInitialImage((prev) => [...prev, url]);
      console.log("Image URL:", url);

      setShowState("carousel"); // Switch to carousel view after upload
    }
  };

  const openDialog = () => {
    setShowCommandBar(true);
  };

  const closeDialog = () => {
    setShowCommandBar(false);
    setSelectedIndex(0); // Reset selected index when closing
  };

  const handleSearchCommandChange = (e) => {
    const value = e.target.value;
    setSearchCommand(value);
    console.log("Search command:", value);

    setSelectedIndex(0); // Reset selected index on search change
  };

  const handleSearchCommandBarKeydown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();

      console.log("ArrowDown pressed");

      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      console.log("ArrowUp pressed");

      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].fn();
        closeDialog(); // close after selection
      }

      console.log("Enter pressed");
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialImage.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + initialImage.length) % initialImage.length
    );
  };

  const onDragStart = (e) => {
    dragItem.current = e.target.id;

    console.log(e.target.id, "drag start");
  };

  const onDragEnter = (e) => {
    dragOverItem.current = e.currentTarget.id;

    console.log(e.currentTarget.id, "drag enter");
  };

  const onDragEnd = () => {
    const copyList = [...initialImage];
    const draggedItem = copyList[dragItem.current];

    copyList.splice(dragItem.current, 1);
    copyList.splice(dragOverItem.current, 0, draggedItem);

    setInitialImage(copyList);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const toggleFullScreen = () => {
    const el = slideshowRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Variable
  const commandBar = [
    {
      title: "Change to manual control mode",
      fn: () => {
        console.log("Manual Control Mode");

        setOperationMode(OperationModes.MANUAL);
      },
    },
    {
      title: "Change to auto-playing mode",
      fn: () => {
        console.log("Auto Playing Mode");

        setOperationMode(OperationModes.AUTO);
      },
    },
    {
      title: "Change to random playing mode",
      fn: () => {
        console.log("Random Playing Mode");
        setOperationMode(OperationModes.RANDOM);
      },
    },
    {
      title: "Switch to theme A",
      fn: () => {
        console.log("Switched to theme A");
      },
    },
    {
      title: "Switch to theme B",
      fn: () => {
        console.log("Switched to theme B");
      },
    },
    {
      title: "Switch to theme C",
      fn: () => {
        console.log("Switched to theme C");
      },
    },
    {
      title: "Switch to theme D",
      fn: () => {
        console.log("Switched to theme D");
      },
    },
    {
      title: "Switch to theme E",
      fn: () => {
        console.log("Switched to theme E");
      },
    },
    {
      title: "Switch to theme F",
      fn: () => {
        console.log("Switched to theme F");
      },
    },
  ];

  const filteredCommands = commandBar.filter((item) =>
    item.title.toLowerCase().includes(searchCommand.toLowerCase())
  );

  return (
    <main className="app">
      {/* Tools bar */}
      <div className="tools-bar-container">
        <button
          type="button"
          onClick={() =>
            setShowState(showState === "upload" ? "carousel" : "upload")
          }
        >
          {showState === "upload" ? "Cancel Upload" : "Upload"}
        </button>
        <button
          className="setting-button"
          type="button"
          onClick={() =>
            setShowState(showState === "settings" ? "carousel" : "settings")
          }
        >
          <img src="/icons/setting-icon.png" alt="Setting Button" />
          {showState === "settings" ? "Close Settings" : "Open Settings"}
        </button>
        <button type="button" onClick={toggleFullScreen}>
          Full Screen
        </button>
      </div>

      {/* Slideshow Component */}
      {showState === "upload" ? (
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
      ) : showState === "settings" ? (
        <div className="panel-settings-container">
          <h2>Setting Panel</h2>

          <div className="panel-settings" id="operation-setting">
            <h3>Operation Mode</h3>

            <div className="menu-list">
              <button
                onClick={() => setOperationMode(OperationModes.MANUAL)}
                className={operationMode === "manual" ? "button-active" : ""}
              >
                Manual
              </button>
              <button
                onClick={() => setOperationMode(OperationModes.AUTO)}
                className={operationMode === "auto" ? "button-active" : ""}
              >
                Auto
              </button>
              <button
                onClick={() => setOperationMode(OperationModes.RANDOM)}
                className={operationMode === "random" ? "button-active" : ""}
              >
                Random
              </button>
            </div>
          </div>
          <div className="panel-settings" id="theme-setting">
            <h3>Theme</h3>
            <div className="menu-list">
              <button>Theme A</button>
              <button>Theme B</button>
              <button>Theme C</button>
              <button>Theme D</button>
              <button>Theme E</button>
              <button>Theme F</button>
            </div>
          </div>
          <div className="panel-settings" id="ordering-setting">
            <h3>Ordering photo</h3>

            <div className="image-lists">
              {initialImage.map((item, index) => (
                <div
                  id={index}
                  draggable
                  onDragStart={onDragStart}
                  onDragEnter={onDragEnter}
                  onDragEnd={onDragEnd}
                  key={item}
                  className="ordering-item"
                >
                  <img src={item} alt={convertImageName(item)} />
                  <p>{convertImageName(item)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div ref={slideshowRef} className="slideshow-container">
            <div className="slideshow-image-wrapper">
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
          </div>

          {/* Manual Mode Controls */}
          {operationMode === OperationModes.MANUAL && (
            <div className="manual-controls">
              <button onClick={goToPrev}>⟨ Prev</button>
              <button onClick={goToNext}>Next ⟩</button>
            </div>
          )}
        </div>
      )}

      {/* Command Bar */}

      {showCommandBar ? (
        <div className="command-bar-container">
          <div className="command-bar" open={showCommandBar}>
            <h3>Command Bar</h3>

            <div className="command-bar-control">
              <input
                type="text"
                placeholder="Enter command...."
                value={searchCommand}
                onChange={handleSearchCommandChange}
                autoFocus
                onKeyDown={handleSearchCommandBarKeydown}
              />

              <div className="command-group">
                {filteredCommands.map((item, index) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      item.fn();
                      closeDialog();
                    }}
                    className={index === selectedIndex ? "active" : ""}
                  >
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
