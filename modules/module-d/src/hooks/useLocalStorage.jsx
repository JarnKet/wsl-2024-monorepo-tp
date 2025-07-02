import { useState, useEffect } from "react";

const useLocalStorage = (key) => {
  const setKeyValue = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getKeyValue = (key) => {
    const res = localStorage.getItem(key);

    const prepareData = JSON.parse(res);

    return prepareData;
  };

  return {
    getKeyValue,
    setKeyValue,
  };
};

export default useLocalStorage;
