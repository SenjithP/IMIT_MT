import pageNotFound from "../assets/images/pageNotFound.jpg"

const NoMatch = () => {
  return (
    <div className="flex items-center justify-center h-screen">
    <img src={pageNotFound} alt="404 error" />
  </div>
  
  )
}

export default NoMatch