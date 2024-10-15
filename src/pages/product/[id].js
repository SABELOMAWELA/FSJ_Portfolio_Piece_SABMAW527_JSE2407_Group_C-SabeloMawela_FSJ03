"use client"; // Ensure this is at the very top for client-side rendering 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../lib/firebase'; // Import the initialized auth
import { onAuthStateChanged } from 'firebase/auth'; // Import necessary functions
import ProductDetailSkeleton from '../../../components/productDetailSkeleton'; // Adjust path if necessary
import Error from '../../../components/404'; // Adjust path if necessary

/**
 * ProductDetail Component
 * Displays detailed information of a selected product including description, reviews, and actions (buy/add to cart).
 * @returns {JSX.Element} The rendered component.
 */
const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  // Normalize the product ID
  const normalizedId = id ? id.toString().padStart(3, '0') : null; // Pad the ID to ensure it matches the Firestore format
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description'); // Track active tab (description/reviews)
  const [sortType, setSortType] = useState('date'); // State to manage the sorting type for reviews
  const [reviewInput, setReviewInput] = useState({ reviewerName: '', rating: 0, comment: '' }); // State for review form
  const [editingReview, setEditingReview] = useState(null); // Track which review is being edited
  const [user, setUser] = useState(null); // Current authenticated user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (normalizedId) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${normalizedId}`);
          if (!response.ok) {
            throw new Error('Product not found');
          }
          const data = await response.json();
          setProduct(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [normalizedId]);

  if (loading) return <ProductDetailSkeleton />; // Show loading skeleton while loading
  if (error) return <Error />; // Show error component in case of an error
  if (!product) return <p className="text-center mt-8">No product found</p>; // Display message if no product is found

  /**
   * Sorts the reviews array based on the selected type (either "date" or "rating").
   * @param {Array} reviews - Array of product reviews.
   * @param {string} type - Sorting type, either "date" or "rating".
   * @returns {Array} Sorted reviews.
   */
  const sortReviews = (reviews, type) => {
    return [...reviews].sort((a, b) => { // Create a copy to avoid mutating state
      if (type === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (type === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });
  };

  /**
   * Handles adding a new review.
   */
  const handleAddReview = async () => {
    if (!user) {
      alert('You must be signed in to add a review.');
      return;
    }

    const token = await user.getIdToken();

    try {
      const response = await fetch('/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...reviewInput, productId: normalizedId }),
      });

      if (response.ok) {
        alert('Review added successfully!');
        setReviewInput({ reviewerName: '', rating: 0, comment: '' });
        // Refresh product data to include the new review
        fetchProductData();
      } else {
        const errorData = await response.json();
        alert(`Failed to add review: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('An unexpected error occurred while adding the review.');
    }
  };

  /**
   * Handles editing an existing review.
   */
  const handleEditReview = async () => {
    if (!user) {
      alert('You must be signed in to edit a review.');
      return;
    }

    const token = await user.getIdToken();

    try {
      const response = await fetch('/api/reviews/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewId: editingReview.id, ...reviewInput }),
      });

      if (response.ok) {
        alert('Review updated successfully!');
        setEditingReview(null);
        setReviewInput({ reviewerName: '', rating: 0, comment: '' });
        // Refresh product data to reflect the edited review
        fetchProductData();
      } else {
        const errorData = await response.json();
        alert(`Failed to edit review: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error editing review:', error);
      alert('An unexpected error occurred while editing the review.');
    }
  };

  /**
   * Handles deleting a review.
   * @param {object} review - The review object to delete.
   */
  const handleDeleteReview = async (review) => {
    if (!user) {
      alert('You must be signed in to delete a review.');
      return;
    }
  
    const token = await user.getIdToken();
  
    try {
      const response = await fetch(`/api/reviews/delete?reviewId=${review.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        alert('Review deleted successfully!');
        // Refresh product data to remove the deleted review
        fetchProductData();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete review: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('An unexpected error occurred while deleting the review.');
    }
  };
  

  /**
   * Fetches the latest product data, including reviews.
   */
  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${normalizedId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiates the edit process for a review.
   * @param {object} review - The review to edit.
   */
  const initiateEditReview = (review) => {
    setEditingReview(review);
    setReviewInput({
      reviewerName: review.reviewerName,
      rating: review.rating,
      comment: review.comment,
    });
  };

  return (
    <div className="font-sans p-8 tracking-wide max-lg:max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 font-bold mb-4 hover:text-indigo-600 transition-all"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back
      </button>

      {/* Main Content */}
      <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Section */}
        <div className="space-y-4 text-center lg:sticky top-8">
          <div className="bg-gray-100 p-4 flex items-center sm:h-[380px] rounded-lg">
            <img
              src={product.images && product.images.length > 0 ? product.images[0] : product.thumbnail}
              alt={product.title}
              className="w-full max-h-full object-contain object-top"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.images && product.images.slice(1).map((image, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 flex items-center rounded-lg sm:h-[182px]"
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full max-h-full object-contain object-top"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="max-w-xl">
          {/* Product Title and Category */}
          <h2 className="text-2xl font-extrabold text-gray-800">{product.title}</h2>
          <p className="text-sm text-gray-600 mt-2">{product.category}</p>
          <h3 className="text-gray-800 text-4xl font-bold mt-4">${product.price}</h3>

          {/* Rating Stars */}
          <div className="flex space-x-1 mt-4">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-5 ${index < Math.round(product.rating) ? 'fill-yellow-400' : 'fill-[#CED5D8]'}`}
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7.2 11.2L3.2855 12.6631L3.40556 8.29787L0.742604 4.83688L4.9313 3.60213L7 0Z" />
              </svg>
            ))}
          </div>

          {/* Tabs for Description and Reviews */}
          <div className="mt-8">
            <ul className="flex border-b">
              <li
                className={`${
                  activeTab === 'description'
                    ? 'text-gray-800 font-bold bg-gray-100 py-3 px-8 border-b-2 border-indigo-600'
                    : 'text-gray-600 font-bold py-3 px-8'
                } cursor-pointer transition-all`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </li>
              <li
                className={`${
                  activeTab === 'reviews'
                    ? 'text-gray-800 font-bold bg-gray-100 py-3 px-8 border-b-2 border-indigo-600'
                    : 'text-gray-600 font-bold py-3 px-8'
                } cursor-pointer transition-all`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </li>
            </ul>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === 'description' ? (
                <>
                  <h3 className="text-lg font-bold text-gray-800">Product Description</h3>
                  <p className="text-sm text-gray-600 mt-4">{product.description}</p>
                  <ul className="space-y-3 list-disc mt-6 pl-4 text-sm text-gray-600">
                    <li>Brand: {product.brand}</li>
                    <li>{product.stock} in stock</li>
                    <li>Availability Status: {product.availabilityStatus}</li>
                    <li>Tags: {product.tags && product.tags.join(', ')}</li>
                    <li>Return Policy: {product.returnPolicy}</li>
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-800">Customer Reviews</h3>

                  {/* Sorting Buttons */}
                  <div className="flex space-x-4 mb-4">
                    <button
                      className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                        sortType === "date" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setSortType("date")}
                    >
                      Sort by Date
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                        sortType === "rating" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setSortType("rating")}
                    >
                      Sort by Rating
                    </button>
                  </div>

                  {/* Reviews List with Edit and Delete Icons */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <ul className="space-y-3 mt-4">
                      {sortReviews(product.reviews, sortType).map((review, index) => (
                        <li key={index} className="text-sm text-gray-600 border-b pb-4 flex justify-between items-start">
                          <div>
                            <p className="font-bold">
                              {review.reviewerName} ({new Date(review.date).toLocaleDateString()})
                            </p>
                            <p>Rating: {review.rating}/5</p>
                            <p>{review.comment}</p>
                          </div>

                          {/* Edit and Delete Icons */}
                          <div className="flex items-center space-x-2">
                            {/* Edit Button */}
                            <button onClick={() => initiateEditReview(review)} className="text-blue-600 hover:text-blue-800">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 3.487a2.25 2.25 0 113.182 3.182L8.31 18.404a4.5 4.5 0 01-1.697 1.07l-3.208 1.069 1.07-3.208a4.5 4.5 0 011.07-1.697L16.862 3.487z"
                                />
                              </svg>
                            </button>

                            {/* Delete Button */}
                            <button onClick={() => handleDeleteReview(review)} className="text-red-600 hover:text-red-800">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 mt-4">No reviews available</p>
                  )}
                </>
              )}

              {/* Add/Edit Review Form */}
              <div className="mt-6">
                <h4 className="text-lg font-bold text-gray-800">
                  {editingReview ? "Edit Your Review" : "Add a Review"}
                </h4>
                <div className="mt-4">
                  <label className="block text-sm font-bold mb-1 text-gray-600" htmlFor="reviewerName">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="reviewerName"
                    className="w-full p-2 border rounded-md"
                    value={reviewInput.reviewerName}
                    onChange={(e) => setReviewInput({ ...reviewInput, reviewerName: e.target.value })}
                    disabled={editingReview} // Disable editing name when editing a review
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-bold mb-1 text-gray-600" htmlFor="rating">
                    Rating
                  </label>
                  <input
                    type="number"
                    id="rating"
                    min="0"
                    max="5"
                    className="w-full p-2 border rounded-md"
                    value={reviewInput.rating}
                    onChange={(e) => setReviewInput({ ...reviewInput, rating: parseInt(e.target.value) })}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-bold mb-1 text-gray-600" htmlFor="comment">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    className="w-full p-2 border rounded-md"
                    rows="4"
                    value={reviewInput.comment}
                    onChange={(e) => setReviewInput({ ...reviewInput, comment: e.target.value })}
                  ></textarea>
                </div>
                <div className="mt-4">
                  <button
                    onClick={editingReview ? handleEditReview : handleAddReview}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editingReview ? "Save Changes" : "Submit Review"}
                  </button>
                  {editingReview && (
                    <button
                      onClick={() => {
                        setEditingReview(null);
                        setReviewInput({ reviewerName: '', rating: 0, comment: '' });
                      }}
                      className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                type="button"
                className="min-w-[200px] px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Buy now
              </button>
              <button
                type="button"
                className="min-w-[200px] px-4 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
