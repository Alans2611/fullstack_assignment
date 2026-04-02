const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to validate HEX color
const isValidHexColor = (color) => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

// Helper function to validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to check if image URL is accessible
const isImageAccessible = async (url) => {
  try {
    const response = await axios.head(url, { timeout: 5000 });
    const contentType = response.headers['content-type'];
    return contentType && contentType.startsWith('image/');
  } catch (error) {
    return false;
  }
};

// POST endpoint for content submission
app.post('/api/content', async (req, res) => {
  try {
    const { heading, paragraph, backgroundImage, textColor } = req.body;

    // Server-side validation
    const errors = {};

    // Required field validation
    if (!heading || heading.trim() === '') {
      errors.heading = 'Heading is required';
    }

    if (!paragraph || paragraph.trim() === '') {
      errors.paragraph = 'Paragraph is required';
    }

    if (!backgroundImage || backgroundImage.trim() === '') {
      errors.backgroundImage = 'Background image URL is required';
    }

    if (!textColor || textColor.trim() === '') {
      errors.textColor = 'Text color is required';
    }

    // HEX color validation
    if (textColor && !isValidHexColor(textColor)) {
      errors.textColor = 'Text color must be a valid HEX code (e.g., #FF5733)';
    }

    // URL validation for background image
    if (backgroundImage && !isValidUrl(backgroundImage)) {
      errors.backgroundImage = 'Background image must be a valid URL';
    }

    // Check if image is accessible
    if (backgroundImage && isValidUrl(backgroundImage)) {
      const isAccessible = await isImageAccessible(backgroundImage);
      if (!isAccessible) {
        errors.backgroundImage = 'Background image URL is not accessible or is not a valid image';
      }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // If validation passes, return success
    res.status(200).json({
      success: true,
      message: 'Content submitted successfully',
      data: {
        heading,
        paragraph,
        backgroundImage,
        textColor
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
