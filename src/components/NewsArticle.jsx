import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const NewsArticle = (props) => {
  const { image, title, description, author, puplishedAt, url } = props;
  return (
    <Card sx={{ width: "100%", margin: "20px auto" }}>
      {image && (
        <CardMedia sx={{ height: 140 }} image={image} title="green iguana" />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block" }}
        >
          <span style={{ fontWeight: "bold", margin: "0 5px" }}>Author</span>
          {author}
        </Typography>
        {puplishedAt && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            <span style={{ fontWeight: "bold", margin: "0 5px" }}>
              Puplished at:
            </span>
            {new Date(puplishedAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <a
          href={url}
          target="_blank"
          style={{
            textDecoration: "none",
            color: "blue",
            fontSize: "16px",
            textTransform: "capitalize",
            margin: "0 10px",
          }}
          size="small"
        >
          go to article
        </a>
      </CardActions>
    </Card>
  );
};

export default NewsArticle;
