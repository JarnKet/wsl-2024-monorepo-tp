import { useState, useEffect } from "react";

import axios from "axios";

import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. The function that performs the fetch
    const fetchData = async () => {
      try {
        // 3. IMPORTANT: Use the full, correct URL for your backend API
        // This URL must match what you are testing with.
        // const response = await axios.get(
        //   "http://localhost:3000/16_module_b/api/users"
        // );
        const response = await axios.get(
          "http://ws01.worldskills.org:3000/16_module_b/api/users"
        );

        // 4. Set the fetched data into state
        setUsers(response.data);
        console.log("Response Data:", response.data);
      } catch (err) {
        // 5. If an error occurs, save it to the error state
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        // 6. This runs after the try/catch, setting loading to false
        setLoading(false);
      }
    };

    // 7. Call the function to execute the fetch
    fetchData();

    // 8. The empty dependency array [] means this effect runs only once
    //    when the component first mounts.
  }, []);

  // --- Render logic to display the state to the user ---

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users?.map((user) => (
          <li key={user?.id}>
            {user?.first_name || "Unnamed User"} {user?.last_name}, {user?.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
