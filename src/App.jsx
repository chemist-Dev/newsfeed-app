import * as React from "react";
import Container from "@mui/material/Container";
import Header from "./components/Header";
import NewsFeed from "./components/NewsFeed";
import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const PAGE_SIZE = 10; // Number of articles per page
const GNEWS_BASE_URL = "https://gnews.io/api/v4/top-headlines";
const DEFAULT_LANGUAGE = "en";
const DEFAULT_COUNTRY = "us";

const Footer = styled("div")(({ theme }) => ({
  padding: theme.spacing(2, 0),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const ErrorMessage = styled("div")(({ theme }) => ({
  color: "red",
  padding: theme.spacing(2),
  textAlign: "center",
  margin: theme.spacing(2, 0),
  backgroundColor: "#ffebee",
  borderRadius: theme.shape.borderRadius,
}));

function App() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("breaking-news");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchArticles = useCallback(
    async (inputQuery, page = 1, currentCategory) => {
      const apiKey =
        import.meta.env.VITE_GNEWS_API_KEY ?? import.meta.env.VITE_NEWS_API_KEY;
      const isDev = import.meta.env.DEV;

      if (isDev && !apiKey) {
        setError("Missing GNews API key. Please set VITE_GNEWS_API_KEY.");
        return;
      }

      try {
        setError(null); // Clear any previous errors
        setLoading(true);

        const endpoint =
          (!isDev && import.meta.env.VITE_GNEWS_PROXY_URL) ||
          (isDev ? GNEWS_BASE_URL : "/api/gnews");

        const params = new URLSearchParams();
        const selectedTopic = currentCategory ?? category;
        if (selectedTopic) {
          params.set("topic", selectedTopic);
        }
        params.set("lang", DEFAULT_LANGUAGE);
        params.set("country", DEFAULT_COUNTRY);
        params.set("max", PAGE_SIZE.toString());
        params.set("page", page.toString());
        if (inputQuery) {
          params.set("q", inputQuery);
        }
        if (isDev) {
          params.set("apikey", apiKey);
        }

        const requestUrl = `${endpoint}?${params.toString()}`;

        const response = await fetch(requestUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data.articles)) {
          throw new Error(
            data.errors?.[0] || data.message || "API Error occurred"
          );
        }
        setArticles(data.articles || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  const debouncedFetchArticles = useMemo(
    () =>
      debounce((newQuery) => {
        fetchArticles(newQuery, currentPage, category);
      }, 700),
    [fetchArticles, currentPage, category]
  );

  useEffect(() => {
    return () => {
      debouncedFetchArticles.cancel();
    };
  }, [debouncedFetchArticles]);

  useEffect(() => {
    fetchArticles("");
  }, [fetchArticles]);

  const handleQueryChange = (newQuery) => {
    debouncedFetchArticles(newQuery);
  };
  const handleNextPage = () => {
    if (currentPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchArticles("", nextPage);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchArticles("", prevPage);
    }
  };
  const categoryChangeHandler = (event) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    // Cancel any pending debounced requests
    debouncedFetchArticles.cancel();
    // Fetch articles immediately with the new category
    fetchArticles("", 1, newCategory);
    setCurrentPage(1);
  };

  return (
    <>
      <Container maxWidth="md">
        <Header
          onChangeQuery={handleQueryChange}
          category={category}
          onCategoryChange={categoryChangeHandler}
        />
        {error ? (
          <ErrorMessage>
            <Typography color="error"> {error}</Typography>
          </ErrorMessage>
        ) : (
          <NewsFeed articles={articles} loading={loading} />
        )}
        <Footer>
          <Button
            variant="outlined"
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
          >
            previous
          </Button>
          <Button
            variant="outlined"
            onClick={handleNextPage}
            disabled={articles.length === PAGE_SIZE || loading}
          >
            next
          </Button>
        </Footer>
      </Container>
    </>
  );
}

export default App;
