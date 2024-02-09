import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import { useCreatePostsMutation } from "../../Slices/postApiSlice";
import { IoMdClose } from "react-icons/io";
import { RotatingLines } from "react-loader-spinner";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const CreatePost = ({ onDataFromChild }) => {
  const { userInfo } = useSelector((state) => state.authentication);

  const fileInputRef = useRef(null);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const allowedExtensions = ["jpg", "jpeg", "png"];
  const [createPosts] = useCreatePostsMutation();

  const sendDataToParent = (count) => {
    onDataFromChild(count);
  };
  useEffect(() => {
    const simulatedData = count;
    sendDataToParent(simulatedData);
  }, [count]);

  const closeFeedButtonHandler = () => {
    setFormData({ ...formData, feedImage: null });
  };

  const [formData, setFormData] = useState({
    feed: "",
    userId: userInfo.id,
    feedImage: null,
  });

  const handleFeedImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        toast.error(
          "Invalid file format. Please choose a .jpg, .jpeg, or .png file."
        );
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, feedImage: reader.result });
      };
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await createPosts(formData).unwrap();
      setCount((prevCount) => prevCount + 1);
      setFormData({
        feed: "",
        feedImage: null,
      });
      toast.success(response.message);
    } catch (error) {
      console.error(error);
      if (error.data && error.data.error) {
        toast.error(error.data.error);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-span-2 flex flex-col items-center justify-center">
      <textarea
        className=" mb-2 bg-gray-100 outline-none rounded-full w-full p-4"
        type="text"
        name="feed"
        value={formData.feed}
        onChange={handleInputChange}
        placeholder="Write your Feeds....."
      />
      <button
        className="bg-[#C08C5D] rounded-full w-full p-4 text-white font-semibold text-lg"
        onClick={handleUploadClick}
      >
        Upload Image
      </button>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFeedImage}
      />
      {formData.feedImage && (
        <div className=" flex gap-5 mt-3   justify-center items-center">
          <IoMdClose onClick={closeFeedButtonHandler} />
          <div className=" flex gap-2 justify-center items-center">
            <p>Selected Image:</p>
            <img
              src={formData.feedImage}
              alt="feed Preview"
              className=" w-[100px] "
            />
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <RotatingLines
            visible={true}
            height="40"
            width="40"
            color="grey"
            strokeWidth="5"
            animationDuration="0.75"
            aria-label="Loading"
            role="alert"
            aria-busy="true"
          />
        </div>
      ) : (
        <div className="flex items-center mt-3 gap-4 cursor-pointer">
          <span
            onClick={submitHandler}
            className="text-gray-700 font-medium mr-2"
          >
            POST
          </span>
          <IoSend class="w-6 h-6 animate-move text-blue-500" />
        </div>
      )}
    </div>
  );
};

CreatePost.propTypes = {
  onDataFromChild: PropTypes.func.isRequired,
};

export default CreatePost;
