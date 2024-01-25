const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const giftsDataPath = path.join(__dirname, "../data/gifts.json");

// Read data from the .json file function
function readGiftsData() {
  const data = fs.readFileSync(giftsDataPath, "utf-8");
  return JSON.parse(data);
}

// Common function for handling 500 error
function handleServerError(res, error, message = "Server Error") {
  console.error(error);
  res.status(500).json({ error: message });
}

// Common function for handling 404 errors
function handleNotFound(res, message = "Not Found") {
  res.status(404).json({ error: message });
}

// Common function for handling 200 success
function handleSuccess(res, data) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(data);
  console.log(data);
}

// Test route to establish the server is running correctly
router.get("/test", function (req, res) {
  handleSuccess(res, "<h1>Test route working</h1>");
});

// route to test if the json data set is working correctly
router.get("/all", function (req, res) {
  try {
    const allGiftData = readGiftsData();
    console.log("allGiftData:", allGiftData);

    // Check if allGiftData is an array before using map
    if (Array.isArray(allGiftData)) {
      const apiResponse = allGiftData.map((data) => ({
        id: data.id,
        provider: data.provider,
        category: data.category,
        title: data.title,
        description: data.description,
        price: data.price,
        image_url: data.image_url,
        logo_url: data.logo_url,
        occasion: data.occasion,
        special_occasion: data.special_occasion,
        recommended: data.recommended,
      }));

      if (apiResponse.length === 0) {
        handleNotFound(res, "No Gifts found");
      } else {
        handleSuccess(res, apiResponse);
      }
    } else {
      // Handle the case where allGiftData is not an array
      handleServerError(res, "Data is not in the expected format");
    }
  } catch (error) {
    handleServerError(res, error);
  }
});

module.exports = router;
