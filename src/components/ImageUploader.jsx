import { useEffect, useRef, useState } from "react";
import axios from "axios";
const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [messageStatus, setMessageStatus] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedSrc, setUploadedSrc] = useState();
  const ref = useRef();

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = () => {
    const url = `http://localhost:8080/api/v1/s3`;
    axios
      .get(url)
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOnChange = (event) => {
    const file = event.target.files[0];
    console.log("file object:", file);
    if (
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg"
    ) {
      setSelectedFile(file);
    } else {
      alert("Select jpg or png file only!!!");
      setSelectedFile(null);
    }
  };

  const formSubmit = (event) => {
    event.preventDefault();

    if (selectedFile) {
      // image upload
      uploadImageToServer();
    } else {
      alert("Select image first...");
    }
  };

  const uploadImageToServer = () => {
    const url = `http://localhost:8080/api/v1/s3`;
    const data = new FormData();
    data.append("file", selectedFile);
    setUploading(true);
    axios
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        setUploadedSrc(response.data);
        getFiles();
        setMessageStatus(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log("Request finished");
        setUploading(false);
      });
  };

  const resetHandler = () => {
    ref.current.value = "";
    setSelectedFile(null);
    setMessageStatus(false);
  };
  return (
    <div className="main flex flex-col items-center justify-center">
      <div className="rounded card w-1/3 border shadow m-4 p-4">
        <h1 className="text-2xl">Image Uploader</h1>
        <div className="form_container">
          <form action="" onSubmit={formSubmit}>
            <div className="field_container flex flex-col gap-y-2">
              <label htmlFor="file">Select Image</label>
              <input
                ref={ref}
                onChange={handleOnChange}
                type="file"
                id="file"
              />
            </div>
            <div className="field_container text-center mt-3">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded">
                Upload
              </button>
              <button
                type="button"
                onClick={resetHandler}
                className="px-3 py-1 bg-orange-700 hover:bg-orange-600 text-white rounded ml-2 ">
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* message alert */}
        {messageStatus && (
          <div
            class="p-4 mb-4 bg-green-100 border-t-4 border-green-500 text-green-700"
            role="alert">
            <p class="font-bold">Success!</p>
            <p>Your operation was successful.</p>
          </div>
        )}

        {/* uploading text and loader */}
        {uploading && (
          <div className="p-3 text-center">
            <div className="flex justify-center items-center min-h-screen">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
            </div>

            <h1>Uploading...</h1>
          </div>
        )}
        {/* uploaded image view */}
        {messageStatus && (
          <div className="uploaded_view">
            <img
              className="h-[300px] mx-auto mt-4 rounded shadow"
              src={uploadedSrc}
              alt=""></img>
          </div>
        )}
      </div>
      {/* show uploaded images sections */}
      <div className="mt-4 flex flex-wrap justify-center">
        {files.map((img) => (
          <img className="h-[200px] m-3" src={img} key={img} />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
