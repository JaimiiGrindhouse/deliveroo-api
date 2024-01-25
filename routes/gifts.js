const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const giftsDataPath = path.join(__dirname, "../data/gifts.json");

// Read data from the .json file function
function readGiftsData() {
  try {
    const data = fs.readFileSync(giftsDataPath, "utf-8");
    console.log("Raw data from file:", data);

    const parsedData = JSON.parse(data);
    console.log("Parsed data:", parsedData);

    if (Array.isArray(parsedData.gift_items)) {
      return parsedData.gift_items;
    } else {
      throw new Error("Data is not in the expected format");
    }
  } catch (error) {
    throw error;
  }
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

// Test route to establish the server is running correctly //
router.get("/test", function (req, res) {
  handleSuccess(res, "<h1>Test route working</h1>");
});

// route to test if the json data set is working correctly //
router.get("/all", function (req, res) {
  try {
    const allGiftData = readGiftsData();
    console.log("allGiftData:", allGiftData);

    // Check if allGiftData is an array
    if (Array.isArray(allGiftData)) {
      if (allGiftData.length === 0) {
        handleNotFound(res, "No Gifts found");
      } else {
        handleSuccess(res, allGiftData);
      }
    } else {
      // Handle the case where allGiftData is not an array
      handleServerError(res, "Data is not in the expected format");
    }
  } catch (error) {
    handleServerError(res, error);
  }
});

// Get Request route to retrieve a gift by category in the url
router.get("/:category", function (req, res) {
  try {
    const category = req.params.category.toLowerCase(); // Convert to lowercase
    const allGiftData = readGiftsData();
    console.log("allGiftData:", allGiftData);
    const filteredGifts = allGiftData.filter(
      (gift) => gift.category.toLowerCase() === category
    );

    if (filteredGifts.length === 0) {
      handleNotFound(res, `No Gifts found in the category: ${category}`);
    } else {
      handleSuccess(res, filteredGifts);
    }
  } catch (error) {
    handleServerError(res, error);
  }
});

// Get request route for retrieving a gift by ID
router.get("/gift/:id", function (req, res) {
  try {
    const giftId = parseInt(req.params.id, 10); // Convert the id to a number
    const allGiftData = readGiftsData();
    console.log("allGiftData:", allGiftData);
    const gift = allGiftData.find((gift) => gift.id === giftId);

    if (!gift) {
      handleNotFound(res, `No Gift found with ID: ${giftId}`);
    } else {
      handleSuccess(res, gift);
    }
  } catch (error) {
    handleServerError(res, error);
  }
});

// Get request Route for retrieving gifts by occasion
router.get("/occasion/:occasion", function (req, res) {
  try {
    const occasion = req.params.occasion;
    const allGiftData = readGiftsData();
    console.log("allGiftData:", allGiftData);
    const giftsByOccasion = allGiftData.filter(
      (gift) => gift.occasion.toLowerCase() === occasion.toLowerCase()
    );

    if (giftsByOccasion.length === 0) {
      handleNotFound(res, `No Gifts found for occasion: ${occasion}`);
    } else {
      handleSuccess(res, giftsByOccasion);
    }
  } catch (error) {
    handleServerError(res, error);
  }
});

// Route for retrieving gifts by special occasion
router.get("/special-occasion/:specialOccasion", function (req, res) {
  try {
    const specialOccasion = req.params.specialOccasion;
    const allGiftData = readGiftsData();
    console.log("allGiftData:", allGiftData);
    const giftsBySpecialOccasion = allGiftData.filter(
      (gift) =>
        gift.special_occasion.toLowerCase() === specialOccasion.toLowerCase()
    );

    if (giftsBySpecialOccasion.length === 0) {
      handleNotFound(
        res,
        `No Gifts found for special occasion: ${specialOccasion}`
      );
    } else {
      handleSuccess(res, giftsBySpecialOccasion);
    }
  } catch (error) {
    handleServerError(res, error);
  }
});

// Get Request route to retrieve a gift by recommended in the url
router.get("/recommended/:recommended", function (req, res) {
  try {
    const recommended = req.params.recommended.toLowerCase(); // Convert to lowercase
    const allGiftData = readGiftsData();
    console.log("allGiftData:", allGiftData);
    const recommendedGifts = allGiftData.filter(
      (gift) => gift.recommended.toLowerCase() === recommended
    );

    if (recommendedGifts.length === 0) {
      handleNotFound(res, `No Gifts found for recommended: ${recommended}`);
    } else {
      handleSuccess(res, recommendedGifts);
    }
  } catch (error) {
    handleServerError(res, error);
  }
});

module.exports = router;
