import * as React from "react";
import Container from "@mui/material/Container";
import Header from "./components/Header";
import NewsFeed from "./components/NewsFeed";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const PAGE_SIZE = 10; // Number of articles per page

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
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedFetchArticles = debounce((newQuery) => {
    setLoading(true);
    fetchArticles(newQuery, currentPage, category).then(() => {
      setLoading(false);
    });
  }, 700);

  const fetchArticles = async (inputQuery, page = 1, currentCategory) => {
    try {
      setError(null); // Clear any previous errors
      setLoading(true);

      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${
          currentCategory ?? category
        }&pageSize=${PAGE_SIZE}&page=${page}&q=${inputQuery}&country=us&apiKey=${
          import.meta.env.VITE_NEWS_API_KEY
        }`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "error") {
        throw new Error(data.message || "API Error occurred");
      }
      setArticles(data.articles || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles("");
  }, []);

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
