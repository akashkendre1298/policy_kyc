import React, { useRef, useState } from "react";
import "./PolicyAndKyc.css";

const PolicyAndKyc = () => {
  const adharRef = useRef(null);
  const imageRef = useRef(null);
  const pdfRef = useRef(null);
  const [result, setResult] = useState("");

  // Hide the message after 3 seconds
  const hideMessageAfterTimeout = () => {
    setTimeout(() => {
      setResult("");
    }, 3000);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    const adharFile = adharRef.current.files[0];
    const imageFile = imageRef.current.files[0];

    if (!adharFile || !imageFile) {
      setResult("Please select both files.");
      return;
    }

    formData.append("adhar", adharFile);
    formData.append("image", imageFile);

    // Log file information to the console for debugging purposes
    console.log("Aadhaar File:", adharFile);
    console.log("Image File:", imageFile);
    console.log("FormData:", formData);

    try {
      // Check if the API URL is accessible from mobile devices
      const response = await fetch("http://148.251.31.66:5000/kycupload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        setResult(` ${responseData.result}`);
      } else {
        setResult(`File upload failed: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setResult(`Error uploading files: ${error.message}`);
    }
  };

  // Function to upload PDF file
  const uploadPDF = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const result = await response.json();
      setResult(`PDF Upload Successful: ${result.result}`);
    } catch (error) {
      setResult("Error uploading PDF: " + error.message);
    }
    hideMessageAfterTimeout();
  };

  const goToApp = () => {
    // For iOS
    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
      window.location.href = "myapp://open"; // Deep link to your app
    }
    // For Android
    else {
      window.location.href =
        "intent://open#Intent;scheme=myapp;package=com.myapp.example;end";
    }
  };

  return (
    <div className="kyc-upload-container">
      {/* KYC Form */}
      <form className="kyc-form">
        <label className="kyc-label">Upload Aadhaar Card (PDF/Image):</label>
        <input
          type="file"
          name="adhar"
          accept=".pdf,.png,.jpg,.jpeg"
          required
          ref={adharRef}
          className="kyc-input"
        />

        <label className="kyc-label">Upload Your Image:</label>
        <input
          type="file"
          name="image"
          accept=".png,.jpg,.jpeg"
          required
          ref={imageRef}
          className="kyc-input"
        />

        <button type="button" className="kyc-button" onClick={uploadFiles}>
          Upload KYC
        </button>
      </form>

      {/* PDF Upload Form */}
      <form
        onSubmit={uploadPDF}
        encType="multipart/form-data"
        className="kyc-form"
      >
        <label className="kyc-label">Upload Policy Details PDF:</label>
        <input
          type="file"
          name="pdf"
          accept=".pdf"
          required
          ref={pdfRef}
          className="kyc-input"
        />

        <button type="submit" className="kyc-button">
          Upload PDF
        </button>
      </form>

      <button onClick={goToApp}>Go To App</button>

      {/* Result Message */}
      {result && <p className="kyc-result">{result}</p>}
    </div>
  );
};

export default PolicyAndKyc;
