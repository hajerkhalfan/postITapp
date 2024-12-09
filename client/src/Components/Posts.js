import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getPosts } from "../Features/PostSlice";
import { Table } from "reactstrap";
import { likePost } from "../Features/PostSlice";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);
  const user = useSelector((state)=>state.users.user)
  const dispatch = useDispatch();
 const navigate=useNavigate();
  useEffect(() => {
    dispatch(getPosts());
  }, []);

      const handleLikePost = (postId) => {
        const postData = {
          postId: postId,
          userId: user._id,
        };
        dispatch(likePost(postData));
        navigate("/home");
      };



  return (
    <div className="postsContainer">
      <Table className="table table-striped">
        <thead></thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              {/* Ensure to add a unique key for each row */}
              <td>{post.email}</td>
              <td>
                <p> {moment(post.createdAt).fromNow()}</p>
                {post.postMsg}
              </td>
              <td>
                <p> {moment(post.createdAt).fromNow()}</p>
                {post.postMsg}
                <p className="likes">
                <Link  onClick={() => handleLikePost(post._id)}>
               <FaThumbsUp />
              </Link>
              ({post.likes.count})
              </p>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div> /* End of posts */
  );
};

export default Posts;
