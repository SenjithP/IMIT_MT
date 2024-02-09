import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { format } from "timeago.js";
import {
  useCreateCommentsMutation,
  useGetCommentPostMutation,
  useLikePostMutation,
  useDeletePostMutation,
  useReplyCommentPostMutation,
} from "../../Slices/postApiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ViewPosts = ({ allPosts, onDataFromChild, onImageClick, searchTerm }) => {
  const [count, setCount] = useState(0);
  const { userInfo } = useSelector((state) => state.authentication);
  const [showAll, setShowAll] = useState(0);
  const [showCommentAll, setShowCommentAll] = useState(0);
  const [createComments] = useCreateCommentsMutation();
  const [postComment, setPostComment] = useState([]);
  const [showCommentsMap, setShowCommentsMap] = useState({});
  const [
    postIdSentToBackEndGetCorrespondingComments,
    setPostIdSentToBackEndGetCorrespondingComments,
  ] = useState(null);
  const [replyFormData, setReplyFormData] = useState({
    replyComment: "",
  });
  const [commentClicked, setCommentClicked] = useState(false);
  const [showRepliesMap, setShowRepliesMap] = useState({});
  const [replyInputStates, setReplyInputStates] = useState({});

  const [getCommentPost] = useGetCommentPostMutation();
  const [likePost] = useLikePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [replyCommentPost] = useReplyCommentPostMutation();

  const sendDataToParent = (count) => {
    onDataFromChild(count);
  };

  useEffect(() => {
    const simulatedData = count;
    sendDataToParent(simulatedData);
  }, [count]);

  const [formData, setFormData] = useState({
    postComment: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (postId) => {
    try {
      const response = await deletePost({
        postId,
      }).unwrap();
      if (response.message) {
        toast.success("Post delete success");
        setCount((prevCount) => prevCount + 1);
      } else {
        toast.error("Post not deleted! Please try again");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const commentSubmitHandler = async (e, postId) => {
    e.preventDefault();
    const { postComment } = formData;
    try {
      const userCommentId = userInfo.id;
      await createComments({
        postId,
        postComment,
        userCommentId,
      }).unwrap();
      setFormData({ postComment: "" });
      setCommentClicked(true);
      toast.success("Comment Added Successfully");
    } catch (error) {
      if (error.data && error.data.error) {
        toast.error(error.data.error);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  const handleCommentClick = async (postId) => {
    setShowCommentsMap((prevMap) => {
      const updatedMap = {};
      Object.keys(prevMap).forEach((prevPostId) => {
        updatedMap[prevPostId] = false;
      });
      updatedMap[postId] = !prevMap[postId];
      return updatedMap;
    });
    setPostIdSentToBackEndGetCorrespondingComments(postId);
    setCommentClicked(true);
  };

  useEffect(() => {
    if (commentClicked) {
      const fetchComments = async () => {
        try {
          const getCommentResult = await getCommentPost({
            id: postIdSentToBackEndGetCorrespondingComments,
          });
          if (getCommentResult.data) {
            const reversedComments = [...getCommentResult.data].reverse();
            setPostComment(reversedComments);
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
        } finally {
          setCommentClicked(false);
        }
      };
      fetchComments();
    }
  }, [
    getCommentPost,
    postIdSentToBackEndGetCorrespondingComments,
    commentClicked,
  ]);

  const handleLikeButtonClick = async (postId) => {
    let response = await likePost({ postId }).unwrap();
    toast.success(response.message);
    setCount((prevCount) => prevCount + 1);
  };

  const filteredPosts = searchTerm
    ? allPosts.filter((post) =>
        post.feed.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allPosts;

  const handleReport = () => {
    toast.success("Post Reported To Admin");
  };

  const handleReplyComment = async (e, commentId) => {
    e.preventDefault();
    const { replyComment } = replyFormData;
    try {
      await replyCommentPost({
        commentId,
        replyComment,
        userCommentId: userInfo.id,
      }).unwrap();
      setReplyFormData({ replyComment: "" });
      setCommentClicked(true);
      setCount((prevCount) => prevCount + 1);
      toast.success("comment reply added");
    } catch (error) {
      console.error(error);
    }
  };

  const handleReplyInputChange = (e) => {
    const { name, value } = e.target;
    setReplyFormData({ ...replyFormData, [name]: value });
  };

  const closeAllReplyForms = () => {
    const updatedMap = {};
    Object.keys(showRepliesMap).forEach((commentId) => {
      updatedMap[commentId] = false;
    });
    setShowRepliesMap(updatedMap);
    setReplyInputStates({});
    setReplyFormData({ replyComment: "" });
  };

  return (
    <>
      {filteredPosts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found</p>
      ) : (
        filteredPosts.map((posts) => (
          <div
            key={posts.id}
            className="bg-white mt-5 rounded-lg md:shadow-md scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-gray-300"
          >
            <div className="flex p-5 gap-5 items-start">
              <div className="flex-shrink-0">
                <div className="inline-block border-[3px] border-[#C08C5D] p-1 rounded-full">
                  <img
                    src={posts?.userId?.userProfileImage}
                    alt="Profile"
                    className="rounded-full w-16 h-16 object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                <h2 className="text-xl font-bold mt-1">
                  {posts?.userId?.userName}
                </h2>
                <h5 className="text-sm text-gray-500">
                  {format(posts.createdAt)}
                </h5>
              </div>
              {posts?.userId?.userName === userInfo.name ? (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(posts?._id)}
                    className="border-[1px] text-[#CF796C] rounded-lg border-[#CF796C] px-8 py-2 text-lg h-14 leading-14"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    onClick={handleReport}
                    className="border-[1px] text-[#CF796C] rounded-lg border-[#CF796C] px-8 py-2 text-lg h-14 leading-14"
                  >
                    Report
                  </button>
                </div>
              )}
            </div>

            <div className="px-5 text-justify">
              <p>
                {showAll === posts?._id
                  ? posts?.feed
                  : posts?.feed.slice(0, 500)}
                {posts?.feed?.length > 501 &&
                  (showAll === posts?._id ? (
                    <span
                      className="text-blue-600 ml-2 cursor-pointer"
                      onClick={() => setShowAll(0)}
                    >
                      Show Less
                    </span>
                  ) : (
                    <span
                      className="text-blue-600 ml-2 cursor-pointer"
                      onClick={() => setShowAll(posts?._id)}
                    >
                      Show More
                    </span>
                  ))}
              </p>
              <img
                className="max-h-[508px] w-full cursor-pointer rounded-lg"
                src={posts.feedImage}
                alt="feedImage"
                onClick={() => onImageClick(posts._id)}
              />
            </div>
            <div className="flex p-5 gap-5 items-start justify-between">
              <div>
                {posts.likes && posts.likes.includes(userInfo?.id)
                  ? posts?.likes.length === 1
                    ? "Liked by You"
                    : `Liked by You and ${posts.likes.length - 1} others`
                  : `Liked by ${posts.likes.length} people`}
              </div>
              <div>{posts?.comments?.length} comments</div>
            </div>

            <div className="flex pb-5 px-5 justify-around text-center">
              <div className="flex w-full ">
                <div className="w-1/2 pr-2">
                  <button
                    onClick={() => handleLikeButtonClick(posts?._id)}
                    className="bg-white h-[50px] border border-solid border-[#CF796C]  text-[#CF796C] font-bold py-2 px-4 rounded-full w-full"
                  >
                    Like
                  </button>
                </div>
                <div className="w-1/2 pl-2">
                  <button
                    onClick={() => {
                      handleCommentClick(posts._id);
                    }}
                    className="bg-[#CF796C] h-[50px]  text-white font-bold py-2 px-4 rounded-full w-full"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>

            {/* COMMENTS  */}
            {showCommentsMap[posts._id] && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    commentSubmitHandler(e, posts._id);
                  }}
                >
                  <div className="flex items-center gap-4   border-gray-300 p-4">
                    <img
                      src={userInfo.profilePhoto}
                      className="w-9 h-9 rounded-full object-cover"
                      alt="Profile"
                    />
                    <div className="flex-1">
                      <textarea
                        placeholder="What's on your mind?"
                        name="postComment"
                        onChange={handleInputChange}
                        value={formData.postComment}
                        className="w-full px-4 h-10 border-b border-solid border-blue-500 focus:outline-none focus:border-b-orange-700 text-16 leading-7 text-black placeholder:text-gray-500 rounded-md cursor-pointer"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-1 bg-orange-700 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                    >
                      Submit
                    </button>
                  </div>
                </form>
                <div
                  className="comments-container scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-gray-300"
                  style={{
                    maxHeight: "400px",
                    overflowX: "hidden",
                    overflowY: "auto",
                  }}
                >
                  <div>
                    {postComment && postComment.length > 0 ? (
                      postComment.map((comments, index) => (
                        <div key={index} className="w-full m-2 py-2">
                          <div className=" flex gap-2 mx-[90px] items-center mb-1">
                            <img
                              src={comments?.userId?.userProfileImage}
                              className="w-9 h-9 rounded-full object-cover"
                              alt="Profile"
                            />
                            <strong>
                              {" "}
                              <p className="font-medium text-base text-ascent-1">
                                {comments.userId.userName}
                              </p>
                            </strong>
                            <span className="text-ascent-2 text-sm">
                              {format(comments.updatedAt)}
                            </span>
                          </div>

                          <div className="mx-[135px]">
                            <p className="flex text-ascent-2 bg-[#ECC8AE] p-3 rounded-b-lg rounded-r-lg text-justify">
                              {showCommentAll === comments?._id
                                ? comments?.postComment
                                : comments?.postComment.slice(0, 300)}
                              {comments?.postComment?.length > 301 &&
                                (showCommentAll === comments?._id ? (
                                  <span
                                    className="text-blue-500 ml-2 cursor-pointer"
                                    onClick={() => setShowCommentAll(0)}
                                  >
                                    Show Less
                                  </span>
                                ) : (
                                  <span
                                    className="text-blue-500 ml-2 cursor-pointer"
                                    onClick={() =>
                                      setShowCommentAll(comments?._id)
                                    }
                                  >
                                    Show More
                                  </span>
                                ))}
                              <span className="flex-grow"></span>
                              <span
                                onClick={() => {
                                  closeAllReplyForms();
                                  setShowRepliesMap((prevMap) => ({
                                    ...prevMap,
                                    [comments._id]: true,
                                  }));
                                  setReplyInputStates((prevStates) => ({
                                    ...prevStates,
                                    [comments._id]: true,
                                  }));
                                }}
                                className="text-[#dc8274] cursor-pointer"
                              >
                                Reply
                              </span>
                            </p>
                          </div>
                          {replyInputStates[comments._id] && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleReplyComment(e, comments._id);
                              }}
                            >
                              <div className="flex  mx-44 items-center gap-4  pt-4">
                                <img
                                  src={userInfo.profilePhoto}
                                  className="w-9 h-9 rounded-full object-cover"
                                  alt="Profile"
                                />

                                <div className="flex-1">
                                  <textarea
                                    placeholder="What's Your reply?"
                                    name="replyComment"
                                    value={replyFormData.replyComment}
                                    onChange={handleReplyInputChange}
                                    className="w-full px-4 h-10 border-b border-solid border-blue-500 focus:outline-none focus:border-b-orange-700 text-16 leading-7 text-black placeholder:text-gray-500 rounded-md cursor-pointer"
                                    required
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="px-4 py-1  bg-orange-700 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                                >
                                  Submit
                                </button>

                                <h6
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setShowRepliesMap((prevMap) => ({
                                      ...prevMap,
                                      [comments._id]: !prevMap[comments._id],
                                    }));
                                  }}
                                >
                                  {showRepliesMap[comments._id]
                                    ? `Hide Replies`
                                    : `Show (${comments.replies.length}) Replies`}
                                </h6>
                              </div>
                            </form>
                          )}
                          {showRepliesMap[comments._id] && (
                            <div>
                              {comments.replies.length > 0 ? (
                                comments.replies.map(
                                  (repliedComment, index) => (
                                    <div key={index} className=" mx-44 mt-6">
                                      <div className="flex  gap-3  items-center m-1">
                                        <img
                                          src={
                                            repliedComment?.userId
                                              .userProfileImage
                                          }
                                          className="w-7 h-7 rounded-full object-cover"
                                          alt="Profile"
                                        />
                                        <div>
                                          <p className="font-medium text-sm text-ascent-1">
                                            {repliedComment?.userId.userName}
                                          </p>
                                          <span className="text-xs">
                                            {format(repliedComment.created_At)}
                                          </span>
                                        </div>
                                      </div>
                                      <p className="ml-11 text-base bg-[#ECC8AE] p-3 rounded-b-lg rounded-r-lg text-justify">
                                        {repliedComment.comment}
                                      </p>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="text-center ">
                                  No replies found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-ascent-2 text-center pb-3 text-sm">
                        No comments available
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </>
  );
};

ViewPosts.propTypes = {
  allPosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.shape({
        userName: PropTypes.string.isRequired,
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
      feed: PropTypes.string.isRequired,
      feedImage: PropTypes.string.isRequired,
      likes: PropTypes.array.isRequired,
    })
  ).isRequired,
  onDataFromChild: PropTypes.func.isRequired,
  onImageClick: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default ViewPosts;
