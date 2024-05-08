import { useState } from 'react';
import "./Form.css"

function PhotoUploadForm(props) {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(
      `caption: ${caption}, location: ${location}, preview: ${file}`
    );

    await postPicture()
    props.onClick();
  };

  const postPicture = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Origin", window.origin);
    
    const formData = new FormData();
    formData.append('photo', file); // photo is what multer uses to process the file
    formData.append('location', location);
    formData.append('caption', caption);

    fetch("http://localhost:8080/api/photos", {
      method: "POST",
      headers: myHeaders,
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      window.location.reload();
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
    });
};

  return (
    <div className="form-container">
      <form className='photo-form' onSubmit={handleSubmit}>
        <input type="text" placeholder="caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="file" onChange={handleImageChange} accept="image/*" />
        {preview && <img className="form-image" src={preview} alt="Preview" />}
        <button type="submit">Submit</button>
      </form>
    </div>

  );
}

export default PhotoUploadForm;
