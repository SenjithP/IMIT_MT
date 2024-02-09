import { useEffect, useState } from "react";
import CreatePost from "../Components/Posts/CreatePost.jsx";
import ViewPosts from "../Components/Posts/ViewPosts.jsx";
import uploadImageCover from "../assets/Images/uploadImageCover.png";
import { useViewPostsMutation } from "../Slices/postApiSlice.js";
import SinglePostModal from "../Components/Posts/SinglePostModal.jsx";
import Header from "../Components/Header.jsx";

const UserHomePage = () => {
  const [count, setCount] = useState(0);
  const [allPosts, setAllPosts] = useState([]);
  const [viewPosts] = useViewPostsMutation();
  const [receivedData, setReceivedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDataFromChild = (count) => {
    setReceivedData(count);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleImageClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await viewPosts();
        if (result.data) {
          let filteredPosts = result.data.allPosts;

          setAllPosts(filteredPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, [count, viewPosts, receivedData]);

  return (
    <section className="">
      <Header onSearch={handleSearch} />

      {/* Create Post */}
      <div className="grid grid-cols-1 md:grid-cols-4 bg-white mx-4 md:mx-[90px] mt-2 p-3 rounded-lg shadow-md">
        <div className=" relative md:col-span-1">
          <div className=" absolute bottom-10 opacity-[10%] left-10 h-[83px] w-[83px] border-[10px]  border-[#C08C5D] rounded-3xl ">
            <div className="absolute  inset-2 bg-[#C08C5D] rounded-2xl "></div>
          </div>
        </div>
        <CreatePost onDataFromChild={handleDataFromChild} />
        <div className="md:col-span-1">
          <img
            className="h-[324px]"
            src={uploadImageCover}
            alt="uploadImageCover"
          />
        </div>
      </div>

      {/* View Posts */}
      <div className="  bg-white mx-4 md:mx-[90px] mt-2 p-3 rounded-lg shadow-md">
        <ViewPosts 
          searchTerm={searchTerm}
          onImageClick={handleImageClick}
          allPosts={allPosts}
          onDataFromChild={handleDataFromChild}
        />
        {showModal && (
          <SinglePostModal
            allPosts={allPosts}
            post={selectedPost}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </section>
  );
};

export default UserHomePage;
