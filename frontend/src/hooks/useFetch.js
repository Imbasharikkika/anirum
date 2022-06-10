import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  let navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();

      if (json?.error) {
        navigate(`/`);
      }

      setData(json);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      navigate(`/`);
    }
  };
  useEffect(() => {
    fetchData();
  }, [url]);

  return { fetchData, loading, error, data };
};

export default useFetch;
