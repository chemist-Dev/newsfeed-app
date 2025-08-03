import React from "react";
import NewsArticle from "./NewsArticle";
import { Box, Typography } from "@mui/material";
import LoadingArticle from "./LoadingArticle";

const NewsFeed = (props) => {
  const { articles, loading } = props;

  if (loading) {
    return (
      <div>
        {[...Array(5)].map((_, index) => (
          <LoadingArticle key={index} />
        ))}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <Typography
        align="center"
        color="textSecondary"
        variant="h4"
        marginTop={6}
      >
        No articles found
      </Typography>
    );
  }

  return (
    <div>
      {articles.map((article) => (
        <NewsArticle
          key={JSON.stringify(article)}
          url={article.url}
          title={article.title}
          image={article.urlToImage}
          description={article.description}
          author={article.author}
          puplishedAt={article.publishedAt}
        />
      ))}
    </div>
  );
};

export default NewsFeed;
