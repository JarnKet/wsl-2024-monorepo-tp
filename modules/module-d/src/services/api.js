import axios from "axios";

export const API = {
  EVENTS: "http://ws01.worldskills.org/module_d_api.php/events.json",
  CARPARKS: "http://ws01.worldskills.org/module_d_api.php/carparks.json",
  WEATHER: "http://ws01.worldskills.org/module_d_api.php/weather.json",
};

export const getWeather = async (params) => {
  try {
    const res = await axios.get(API.WEATHER, {
      params: params,
    });

    const data = res.data;

    return data;
  } catch (error) {
    console.error("Error :", error);
  }
};

export const getEvents = async (params) => {
  try {
    const res = await axios.get(API.EVENTS, {
      params: params,
    });

    const data = res.data;

    return data;
  } catch (error) {
    console.error("Error :", error);
  }
};

export const getCarparks = async (params) => {
  try {
    const res = await axios.get(API.CARPARKS, {
      params: params,
    });

    const data = res.data;

    return data;
  } catch (error) {
    console.error("Error :", error);
  }
};
