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

  // Function to upload KYC files (Aadhaar and Image)
  const uploadKYCFiles = async () => {
    const formData = new FormData();
    const adharFile = adharRef.current.files[0];
    const imageFile = imageRef.current.files[0];

    if (!adharFile || !imageFile) {
      setResult("Please select both Aadhaar and image files.");
      hideMessageAfterTimeout();
      return;
    }

    formData.append("adhar", adharFile);
    formData.append("image", imageFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/kycupload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setResult(`KYC Upload Successful: ${responseData.result}`);
      } else {
        setResult(`KYC Upload Failed: ${responseData.message}`);
      }
    } catch (error) {
      setResult(`Error uploading KYC files: ${error.message}`);
    }
    hideMessageAfterTimeout();
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
    const responseData = result ? encodeURIComponent(result) : "";

    // Log the response data for debugging
    console.log("KYC Response Data:", responseData);

    // Post message to parent first
    window.postMessage(
      JSON.stringify({ result: "KYC Upload Successful!" }),
      "*"
    );

    // Then navigate back to the app using deep linking
    window.location.href = `myapp://open?data=${responseData}`;

    console.log("KYC Response sent to app:", responseData);
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

        <button type="button" className="kyc-button" onClick={uploadKYCFiles}>
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
