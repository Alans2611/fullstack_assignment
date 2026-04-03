import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';
import { contentAPI } from './api';

const App = () => {
  const [formData, setFormData] = useState({
    heading: '',
    paragraph: '',
    backgroundImage: '',
    textColor: '#000000'
  });

  const [previewData, setPreviewData] = useState({
    heading: 'Default Heading',
    paragraph: 'This is the default preview content. Submit the form to see your content displayed here with custom styling.',
    backgroundImage: 'https://picsum.photos/800/400',
    textColor: '#333333'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.heading.trim()) {
      newErrors.heading = 'Heading is required';
    }

    if (!formData.paragraph.trim()) {
      newErrors.paragraph = 'Paragraph is required';
    }

    if (!formData.backgroundImage.trim()) {
      newErrors.backgroundImage = 'Background image URL is required';
    }

    if (!formData.textColor.trim()) {
      newErrors.textColor = 'Text color is required';
    }

    // HEX color validation
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (formData.textColor && !hexRegex.test(formData.textColor)) {
      newErrors.textColor = 'Text color must be a valid HEX code (e.g., #FF5733)';
    }

    // URL validation for background image
    try {
      if (formData.backgroundImage) {
        new URL(formData.backgroundImage);
      }
    } catch {
      newErrors.backgroundImage = 'Background image must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle rich text editor change
  const handleParagraphChange = (value) => {
    setFormData(prev => ({
      ...prev,
      paragraph: value
    }));

    // Clear error for paragraph when user starts typing
    if (errors.paragraph) {
      setErrors(prev => ({
        ...prev,
        paragraph: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await contentAPI.submitContent(formData);
      
      if (response.data.success) {
        setSubmitMessage('Content submitted successfully!');
        setPreviewData(formData);
        // Clear form
        setFormData({
          heading: '',
          paragraph: '',
          backgroundImage: '',
          textColor: '#000000'
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.response && error.response.status === 400) {
        // Server validation errors
        setErrors(error.response.data.errors || {});
        setSubmitMessage('Please fix the validation errors');
      } else {
        // Use the enhanced error message from our API interceptor
        setSubmitMessage(error.message || 'Error submitting form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">Dynamic Content Manager</h1>
      
      <div className="container">
        {/* Form Section */}
        <div className="form-section">
          <h2>Create Content</h2>
          <form onSubmit={handleSubmit} className="content-form">
            <div className="form-group">
              <label htmlFor="heading">Heading *</label>
              <input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                className={errors.heading ? 'error' : ''}
                placeholder="Enter your heading"
              />
              {errors.heading && <span className="error-message">{errors.heading}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="paragraph">Paragraph *</label>
              <ReactQuill
                value={formData.paragraph}
                onChange={handleParagraphChange}
                theme="snow"
                placeholder="Enter your paragraph content"
                className={errors.paragraph ? 'error quill-error' : ''}
              />
              {errors.paragraph && <span className="error-message">{errors.paragraph}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="backgroundImage">Background Image URL *</label>
              <input
                type="url"
                id="backgroundImage"
                name="backgroundImage"
                value={formData.backgroundImage}
                onChange={handleInputChange}
                className={errors.backgroundImage ? 'error' : ''}
                placeholder="https://example.com/image.jpg"
              />
              {errors.backgroundImage && <span className="error-message">{errors.backgroundImage}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="textColor">Text Color (HEX) *</label>
              <input
                type="text"
                id="textColor"
                name="textColor"
                value={formData.textColor}
                onChange={handleInputChange}
                className={errors.textColor ? 'error' : ''}
                placeholder="#FF5733"
              />
              {errors.textColor && <span className="error-message">{errors.textColor}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('success') ? 'success' : 'error'}`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <h2>Content Preview</h2>
          <div 
            className="content-preview"
            style={{
              backgroundImage: `url(${previewData.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '400px',
              position: 'relative'
            }}
          >
            <div 
              className="content-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                textAlign: 'center'
              }}
            >
              <h1 
                style={{
                  color: previewData.textColor,
                  fontSize: '2.5rem',
                  marginBottom: '20px',
                  fontWeight: 'bold'
                }}
              >
                {previewData.heading}
              </h1>
              <div 
                style={{
                  color: previewData.textColor,
                  fontSize: '1.2rem',
                  lineHeight: '1.6',
                  maxWidth: '600px'
                }}
                dangerouslySetInnerHTML={{ __html: previewData.paragraph }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
