import type { NextPage } from "next";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

import {
  Favorite,
  Share,
  ExpandMore as ExpandMoreIcon,
  MoreVert,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
const COMMENTS_API_LINK = "https://jsonplaceholder.typicode.com/comments";
const POSTS_API_LINK = "https://jsonplaceholder.typicode.com/posts";

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type PageProps = {
  comments: Comment[];
  posts: Post[];
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Feed: NextPage<PageProps> = ({ posts, comments }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {}, []);

  return (
    <Container>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader title={post.title} />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {post.body}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <Favorite />
            </IconButton>
            <IconButton aria-label="share">
              <Share />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Comments postId={post.id} comments={comments} />
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </Container>
  );
};

const Comments = ({
  postId,
  comments,
}: {
  postId: number;
  comments: Comment[];
}) => {
  const postComments = comments.filter((comment) => comment.postId === postId);
  return (
    <>
      {postComments.map((comment) => (
        <Typography variant="body2" color="text.secondary" key={comment.id}>
          {comment.body}
        </Typography>
      ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const [postsResponse, commentsResponse] = await Promise.all([
    fetch(POSTS_API_LINK),
    fetch(COMMENTS_API_LINK),
  ]);

  const [posts, comments] = await Promise.all([
    postsResponse.json(),
    commentsResponse.json(),
  ]);

  return {
    props: {
      posts,
      comments,
    },
  };
};

export default Feed;
