import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";

const LoadingArticle = () => {
  return (
    <Card sx={{ width: "100%", margin: "20px auto" }}>
      <Skeleton variant="rectangular" sx={{ height: 140 }} animation="wave" />
      <CardContent>
        <Skeleton
          variant="text"
          width="80%"
          height={32}
          animation="wave"
          sx={{ marginBottom: 1 }}
        />
        <Skeleton
          variant="text"
          width="100%"
          height={20}
          animation="wave"
          count={3}
          sx={{ marginBottom: 1 }}
        />
        <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
          <Skeleton variant="text" width={100} height={20} animation="wave" />
          <Skeleton variant="text" width={150} height={20} animation="wave" />
        </Box>
      </CardContent>
      <CardActions>
        <Skeleton variant="rectangular" width={100} animation="wave" />
      </CardActions>
    </Card>
  );
};

export default LoadingArticle;
