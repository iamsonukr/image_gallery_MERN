
import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [image,setImage]=useState();
  const [allimages,setAllimages]=useState();

  const submitImage=async(e)=>{
    e.preventDefault();
    const formData=new FormData();
    formData.append("image",image)

    const result=await axios.post(
      "http://localhost:5000/upload-image",
      formData,
      {
        headers:{"Content-Type":"multipart/form-data"}
      }
    )
  }

  const onInputChange=(e)=>{
    console.log(e.target.files[0])
    setImage(e.target.files[0])
    
  }
  const getImage=async()=>{
    const result=await axios.get('http://localhost:5000/get-image')
    // console.log(result)
    // console.log(result.data.data)
    setAllimages(result.data.data)
  }  

  // const deleteImg=async(id)=>{
  //   // e.preventDefault
  //   const result=await axios.delete(`http://localhost:5000/delete-img/${id}`)
  //   window.alert("Data Deleted Successfully")
  //   getImage()

  // }

  const deleteImg = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:5000/delete-img/${id}`);
  
      // Check if the server responded with a 200 OK status
      if (result.status === 200) {
        window.alert("Data Deleted Successfully");
        getImage(); // Assuming getImage() fetches updated image data
      } else {
        window.alert("Failed to delete image. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      window.alert("Failed to delete image. Please try again later.");
    }
  };


  useEffect(()=>{
    getImage()
  },[])
  return (
    <>
      <form action="">
        <input type="file" accept='image/*' onChange={onInputChange} />
        <button type="submit" onClick={submitImage}>Submit</button>
      </form>
    
      <h2>Image Gallery</h2>
      {
        allimages==null?"":
        allimages.map((data)=>{
          console.log(data.image);
          console.log(data._id);
          
          return (
            < div key={data.id} >
            {/* <img src={(`./images/${data.images}`)}/> */}
            <img height={'80px'}  src={'./images/' + data.image}/>
            {/* <button onClick={()=>deleteImg(data._id)}>Delete</button> */}
            </div>
          )
        })
      }
    </>
  )
}

export default App
