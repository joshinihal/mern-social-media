import { useEffect, useState, useContext } from "react";

import useHttp from "../../hooks/use-http";
import PostCard from "../ui/PostCard";
import classes from "./Home.module.css";
import PostForm from "../ui/PostForm";
import { AuthContext } from "../../context/auth";

const Home = () => {
  const apiBaseUrl = process.env.REACT_APP_APIBASEURL;
  console.log('base url is ', apiBaseUrl)
  const context = useContext(AuthContext);
  const url = `${apiBaseUrl}/posts`;
  const [postItems, setPostItems] = useState([]);
  const { sendRequest: fetchPostsData, error, isLoading } = useHttp();

  const transformPosts = (posts) => {
    setPostItems(posts.data);
  };

  useEffect(() => {
    fetchPostsData({ url }, transformPosts);
    // use cleanup to clean pending tasks if component is unmounted
    // return () => {
    //   setPostItems([]);
    // };
  }, [fetchPostsData, url]);

  const handleSuccess = () => {
    fetchPostsData({ url }, transformPosts);
  };

  return (
    <div className={classes["posts-container"]}>
      <h2 className={classes["recent-posts"]}>Recent Posts</h2>
      {context.user ? <PostForm onCreateSuccess={handleSuccess} /> : ""}
      {!error && isLoading ? (
        <div className={classes["loading-message"]}>Loading...</div>
      ) : (
        ""
      )}
      {error && !isLoading ? (
        <div className={classes["error-message"]}>{error}</div>
      ) : (
        ""
      )}
      {!error && !isLoading && postItems && postItems.length === 0 ? (
        <div className={classes["loading-message"]}>'No posts added yet!'</div>
      ) : (
        ""
      )}
      {!error && !isLoading && postItems && postItems.length > 0
        ? postItems.map((post) => {
            return (
              <PostCard
                onLikeSuccess={handleSuccess}
                key={post._id}
                id={post._id}
                username={post.username}
                body={post.body}
                likes={post.likes}
                comments={post.comments}
                date={post.createdAt}
              />
            );
          })
        : ""}
    </div>
  );
};

export default Home;
