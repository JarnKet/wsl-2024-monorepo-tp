import useLocalStorage from "../hooks/useLocalStorage";

const SettingPage = () => {
  const { setKeyValue, getKeyValue } = useLocalStorage();

  const theme = getKeyValue("theme");
  const sorting = getKeyValue("sorting");

  const handleOnChange = (key, data) => {
    setKeyValue(key, data);
  };

  return (
    <section className="content-wrapper" id="setting-page">
      <div className="setting-item">
        <h2>Dark Mode</h2>

        <select
          onChange={(e) => handleOnChange("theme", e.target.value)}
          name="theme"
          id="theme"
          value={theme}
        >
          <option disabled selected>
            Choose Your Theme
          </option>
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
        </select>
      </div>

      <div className="setting-item">
        <h2>Carpark Sorting Method</h2>

        <select
          name="sorting"
          id="sorting"
          value={sorting}
          onChange={(e) => handleOnChange("sorting", e.target.value)}
        >
          <option disabled selected>
            Choose Your Sorting method
          </option>
          <option value="alphabet">Alphabet</option>
          <option value="distance">Distance</option>
        </select>
      </div>
    </section>
  );
};

export default SettingPage;
