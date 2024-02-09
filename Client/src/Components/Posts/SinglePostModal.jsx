import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  useGetCommentPostMutation,
  useGetSinglePostMutation,
  useGetSingleImagesMutation,
} from "../../Slices/postApiSlice";
import { format } from "timeago.js";
import { useSelector } from "react-redux";
import { IoSend } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { GrPrevious, GrNext } from "react-icons/gr";
import { toast } from "react-toastify";

const SinglePostModal = ({ post, onClose }) => {
  const { userInfo } = useSelector((state) => state.authentication);

  const [singlePost, setSinglePost] = useState([]);
  const [postComment, setPostComment] = useState([]);
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(0);
  const [showCommentAll, setShowCommentAll] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);

  const [getSinglePost] = useGetSinglePostMutation();
  const [getCommentPost] = useGetCommentPostMutation();
  const [getSingleImages] = useGetSingleImagesMutation();

  const handleReport = () => {
    toast.success("Post Reported To Admin");
  };

  const handleNextPage = () => {
    if ((pageIndex + 1) * 3 < images.length) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await getSingleImages({ id: post }).unwrap();
        if (result) {
          setImages(result);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [getSingleImages, post]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const getCommentResult = await getCommentPost({
          id: post,
        });

        if (getCommentResult.data) {
          const reversedComments = [...getCommentResult.data].reverse();
          setPostComment(reversedComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [getCommentPost, post]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSinglePost({ id: post }).unwrap();
        if (result) {
          setSinglePost(result);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [getSinglePost, count, post]);

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen  bg-gray-900 bg-opacity-50">
      <div className="bg-white relative overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-gray-300 rounded-lg w-11/12 lg:w-4/5 h-[700px]">
        <button
          className="absolute right-0 top-0 bg-gray-300 p-2 rounded-bl-2xl"
          onClick={onClose}
        >
          <IoMdClose />
        </button>

        <div className="p-5 flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2">
            <img
              className="h-[438px] lg:h-full w-full rounded-l"
              src={singlePost.feedImage}
              alt="feedImage"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="flex p-5 gap-5 border-b-[0.5px] items-start justify-between">
              <div className="flex flex-shrink-0">
                <div className="inline-block border-[3px] border-[#C08C5D] p-1 rounded-full">
                  <img
                    src={singlePost?.userId?.userProfileImage}
                    alt="Profile"
                    className="rounded-full w-16 h-16 object-cover"
                  />
                </div>

                <div className="ml-3">
                  <h2 className="text-xl font-bold mt-1">
                    {singlePost?.userId?.userName}
                  </h2>
                  <h5 className="text-sm text-gray-500">
                    {format(singlePost?.createdAt)}
                  </h5>
                </div>
              </div>
              <button
                onClick={handleReport}
                className="w-28 outline-none h-10 top-32 left-16 rounded border border-[#CF796C] font-normal text-base leading-14 text-[#CF796C]"
              >
                Report
              </button>
            </div>
            <div className="flex ml-4 mt-4 justify-between">
              <button className="flex-1 bg-white border border-solid outline-none border-[#CF796C] text-[#CF796C] font-bold py-2 px-4 rounded-full mr-2">
                <div className="flex justify-center items-center gap-2">
                  <CiHeart className="w-6 h-6" />
                  <span className="text-lg">Like</span>
                </div>
              </button>
              <button className="flex-1 bg-[#CF796C] outline-none text-white font-bold py-2 px-4 rounded-full ml-2">
                Comment
              </button>
            </div>
            <div className="relative bg-[#f4f3f3] mt-2 rounded-lg ml-5 max-h-64 lg:h-auto overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-gray-300 flex flex-col">
              <div className="flex-grow">
                {postComment && postComment.length > 0 ? (
                  postComment.map((comments, index) => (
                    <div key={index} className="w-full m-2 py-2">
                      <div className="flex gap-2 mx-3 items-center mb-1">
                        <img
                          src={userInfo.profilePhoto}
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

                      <div className="mx-14">
                        <p className="text-ascent-2 bg-[#ECC8AE] p-3 rounded-b-lg rounded-r-lg text-justify">
                          {showCommentAll === comments?._id
                            ? comments?.postComment
                            : comments?.postComment.slice(0, 300)}
                          {comments?.postComment?.length > 301 &&
                            (showCommentAll === comments?._id ? (
                              <span
                                className="text-blue-600 ml-2 cursor-pointer"
                                onClick={() => setShowCommentAll(0)}
                              >
                                Show Less
                              </span>
                            ) : (
                              <span
                                className="text-blue-600 ml-2 cursor-pointer"
                                onClick={() => setShowCommentAll(comments?._id)}
                              >
                                Show More
                              </span>
                            ))}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-ascent-2 text-center pb-3 text-sm">
                    No comments available
                  </p>
                )}
              </div>
              <div className="mx-5 mt-10 mb-5 relative flex flex-col items-start">
                <img
                  src={userInfo.profilePhoto}
                  className="absolute w-[40px] h-[40px] rounded-full mb-2"
                  alt="profileImg"
                />
                <input
                  placeholder="Write a comment... "
                  type="text"
                  className="outline-none w-full px-14 py-2 bg-[#ECC8AE] rounded-3xl placeholder-black placeholder-opacity-30"
                />

                <IoSend class="cursor-pointer absolute right-4 top-2 w-6 h-6 text-[#CF796C]" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5 mt-5 sm:mt-8 lg:mx-10">
          <h1 className="font-medium text-2xl leading-7">
            All Images By {singlePost?.userId?.userName}
          </h1>

          <div className="relative">
            <div className="flex flex-wrap justify-evenly mt-4 sm:mt-6">
              {images
                .slice(pageIndex * 3, (pageIndex + 1) * 3)
                .map((image, index) => (
                  <img
                    key={index}
                    className="h-[150px] rounded-lg m-2"
                    src={image.feedImage}
                    alt={`Image ${index + 1}`}
                  />
                ))}
            </div>
            {images.length > 3 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="absolute left-0"
                  onClick={handlePrevPage}
                  disabled={pageIndex === 0}
                >
                  <GrPrevious />
                </button>
                <button
                  className="absolute right-0"
                  onClick={handleNextPage}
                  disabled={(pageIndex + 1) * 3 >= images.length}
                >
                  <GrNext />
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-center mt-16 sm:mt-16">
          NB: Please note that the datas displayed in this modal is dynamic,
          however, the functionalities are currently under construction.
        </p>
      </div>
    </div>
  );
};
SinglePostModal.propTypes = {
  post: PropTypes.shape({
    feedImage: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
export default SinglePostModal;
