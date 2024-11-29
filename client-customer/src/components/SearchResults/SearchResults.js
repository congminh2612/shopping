// SearchResults.js
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useLocation } from "react-router-dom";
import "./SearchResults.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get("query"); // Lấy từ khóa tìm kiếm từ URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await API.get("/user/products", {
          params: {
            search: searchTerm,
          },
        });
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
      setLoading(false);
    };

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]);

  return (
    <div className="search-results-container">
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        results.map((result) => (
          <div key={result._id} className="result-item">
            <h4>{result.name}</h4>
            <p>{result.price.toLocaleString()} VND</p>
          </div>
        ))
      ) : (
        <p>Không tìm thấy kết quả nào phù hợp</p>
      )}
    </div>
  );
}

export default SearchResults;
