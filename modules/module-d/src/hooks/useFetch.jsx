import { useState, useEffect } from "react";

const useFetch = (queryFn) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resData = await queryFn();

        setData(resData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryFn]);

  return {
    data,
    loading,
    error,
  };
};

export default useFetch;
