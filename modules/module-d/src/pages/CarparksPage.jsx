import React, { useState } from "react";

// Hooks
import useFetch from "../hooks/useFetch";
import useLocalStorage from "../hooks/useLocalStorage";

// Services
import { getCarparks } from "../services/api";

// Helpers
import { getDistanceFromLatLonInKm } from "../helpers/geolocation_distance";

const CarparksPage = () => {
  const myLocation = {
    latitude: 45.755051,
    longitude: 4.846358,
  };3
  const { data, loading, error } = useFetch(getCarparks);
  const { getKeyValue, setKeyValue } = useLocalStorage();

  // State
  const [focus, setFocus] = useState();

  const sorting = getKeyValue("sorting");
  const pinnedCarpark = JSON.parse(getKeyValue("pinnedCarpark"));

  if (loading) {
    return <>Loading ...</>;
  }

  if (error) {
    return <>Error {error}</>;
  }

  // console.log("Sorting", sorting); // alphabet , distance
  console.log("Pined Location", pinnedCarpark);

  // Functions
  const handlePinCarpark = (item) => {
    setKeyValue("pinnedCarpark", JSON.stringify(item));
  };

  let carparks = data
    ? Object.entries(data).map(([name, info]) => ({
        name,
        ...info,
      }))
    : [];

  if (sorting === "alphabet") {
    carparks.sort((a, b) =>
      a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
    );
  } else if (sorting === "distance") {
    carparks.sort((a, b) => {
      const distA = getDistanceFromLatLonInKm(
        myLocation.latitude,
        myLocation.longitude,
        a.latitude,
        a.longitude
      );
      const distB = getDistanceFromLatLonInKm(
        myLocation.latitude,
        myLocation.longitude,
        b.latitude,
        b.longitude
      );
      return distA - distB;
    });
  }

  return (
    <section className="content-wrapper" id="carparks-page">
      <h2>Carparks</h2>

      <div className="pinned-container">
        <h3>{pinnedCarpark?.location}</h3>

        <h4>{pinnedCarpark?.name}</h4>
      </div>

      <ul>
        {carparks?.map((item) => {
          const isFocus = item?.name === focus;

          return (
            <li onClick={() => setFocus(item?.name)}>
              <div className={isFocus ? "focus-active" : ""}>
                <h3>{item?.location}</h3>

                {isFocus ? (
                  <div className="focus-detail">
                    <h4>name: {item?.name}</h4>
                    <p>spaces: {item?.availableSpaces}</p>
                    <small>
                      distance:{" "}
                      {getDistanceFromLatLonInKm(
                        myLocation.latitude,
                        myLocation.longitude,
                        item?.latitude,
                        item?.longitude
                      )}{" "}
                      km
                    </small>

                    <button
                      style={{ display: "block" }}
                      type="button"
                      onClick={() => handlePinCarpark(item)}
                    >
                      Pin Location
                    </button>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CarparksPage;
