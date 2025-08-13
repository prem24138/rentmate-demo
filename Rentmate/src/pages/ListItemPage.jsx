import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function ListItemPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    location: "",
    description: "",
    features: [''],
    ratings: '',
    rules: [''],
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);

  // Categories
  const categories = [
    { value: "vehicles", label: "Vehicles" },
    { value: "electronics", label: "Electronics" },
    { value: "furniture", label: "Furniture" },
    { value: "appliances", label: "Appliances" },
    { value: "tools", label: "Tools & Equipment" },
    { value: "sports", label: "Sports & Outdoors" },
    { value: "fashion", label: "Fashion & Accessories" },
    { value: "other", label: "Other" }
  ];

  // Check auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsub();
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 5 images allowed"
      }));
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);

    setFormData((prev) => ({
      ...prev,
      images: files
    }));

    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: ""
      }));
    }
  };

  // Update a single item in an array (features or rules)
  const handleArrayChange = (index, value, field) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  // Add a new empty item to the array
  const handleAddItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  // Remove an item from the array
  const handleRemoveItem = (index, field) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };


  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be a valid positive number";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    else if (formData.description.length < 20)
      newErrors.description = "Description must be at least 20 characters";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";
    if (!formData.features.length || formData.features.some(f => !f.trim())) {
      errors.features = 'Please enter at least one feature.';
    }

    if (!formData.rules.length || formData.rules.some(r => !r.trim())) {
      errors.rules = 'Please enter at least one rule.';
    }


    return newErrors;
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async () => {
    const urls = [];

    for (const file of formData.images) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "product_images"); // from Cloudinary
      data.append("cloud_name", "dykeszwq4");       // from Cloudinary

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dykeszwq4/image/upload`,
        {
          method: "POST",
          body: data
        }
      );

      const uploadedImage = await res.json();
      urls.push(uploadedImage.secure_url);
    }

    return urls;
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      const imageUrls = await uploadImagesToCloudinary();

      await addDoc(collection(db, "items"), {
        ...formData,
        images: imageUrls,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      alert("Item listed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error listing item:", error);
      alert("Error listing item. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">List Your Item</h1>

          {/* Error summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
              <h3 className="text-lg font-medium mb-2">Please fix the following errors:</h3>
              <ul className="list-disc pl-5">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Title */}
                  <div className="col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Item Title*
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="e.g. iPhone 13 Pro Max"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category*
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location*
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="e.g. New York, NY"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Pricing
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price Per Day*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Set a competitive daily rental price
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Description
                </h2>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Item Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Describe your item in detail. Include condition, features, and any other relevant information."
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum 20 characters. Detailed descriptions help renters make informed decisions.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Features
                </h2>

                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                      className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.features ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder={`Feature ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index, 'features')}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddItem('features')}
                  className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  + Add Feature
                </button>
                {errors.features && (
                  <p className="text-red-500 text-sm mt-1">{errors.features}</p>
                )}
              </div>

              {/* Rules */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Rules
                </h2>

                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'rules')}
                      className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.rules ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder={`Rule ${index + 1}`}
                    />
                    {formData.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index, 'rules')}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddItem('rules')}
                  className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  + Add Rule
                </button>
                {errors.rules && (
                  <p className="text-red-500 text-sm mt-1">{errors.rules}</p>
                )}
              </div>


              {/* Images */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Images
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Images* (Up to 5)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300 hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload files</span>
                          <input
                            id="images"
                            name="images"
                            type="file"
                            accept="image/*"
                            multiple
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                  )}

                  {/* Image previews */}
                  {imagePreview.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Images:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {imagePreview.map((src, index) => (
                          <div key={index} className="relative">
                            <img
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Listing Item...
                      </span>
                    ) : (
                      'List Item'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ListItemPage;