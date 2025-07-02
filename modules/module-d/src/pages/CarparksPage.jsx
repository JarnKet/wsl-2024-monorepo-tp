import React from "react";

// Hooks
import useFetch from "../hooks/useFetch";

// Services
import { getCarparks } from "../services/api";

const CarparksPage = () => {
  const { data, loading, error } = useFetch(getCarparks);

  if (loading) {
    return <>Loading ...</>;
  }

  if (error) {
    return <>Error {error}</>;
  }

  console.log("Data", data);

  return <div>Carparks</div>;
};

export default CarparksPage;
