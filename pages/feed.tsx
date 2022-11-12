import type {NextPage} from "next";
import {GetServerSideProps} from "next";
import {styled} from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import {Comment as CommentIcon,} from "@mui/icons-material";

import {useState} from "react";
import {Badge, Container} from "@mui/material";

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
})(() => ({
  marginLeft: "auto",
}));

const Feed: NextPage<PageProps> = ({ posts, comments }) => {

    const [expandedPosts, setExpandedPosts] = useState(
        Object.fromEntries(posts.map((post) => [post.id, false]))
    );

    //create an object with postId as key and amount of comments as value
    const commentsPerPost = Object.fromEntries(
        posts.map((post) => [
          post.id,
          comments.filter((comment) => comment.postId === post.id).length,
        ])
    );


  const handleExpandClick = (postId) => {
    setExpandedPosts((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

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
            <ExpandMore
              expand={expandedPosts[post.id]}
              onClick={() => handleExpandClick(post.id)}
              aria-expanded={expandedPosts[post.id]}
              aria-label="show more"
            >
                <Badge badgeContent={commentsPerPost[post.id]} color="primary">
              <CommentIcon />
                </Badge>
            </ExpandMore>
          </CardActions>
          <Collapse in={expandedPosts[post.id]} timeout="auto" unmountOnExit>
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
      <Typography variant="h6" gutterBottom component="div">
        Comments
        </Typography>
      {postComments.map((comment) => (
        <Typography variant="body2" color="text.secondary" key={comment.id} mb={2}>
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
