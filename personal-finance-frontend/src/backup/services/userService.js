import axios from 'axios';

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, userData);
    console.log('User registered:', response.data);
    return response.data; // Return the response for further use
  } catch (error) {
    console.error('Error registering user:', error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};

export { registerUser };
