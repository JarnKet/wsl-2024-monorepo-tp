import { useEffect, useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState("");

  useEffect(() => {}, []);

  return {
    theme,
    setTheme,
  };
};

export default useTheme;
