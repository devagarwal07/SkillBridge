import mongoose from "mongoose";

let isConnected = false;
let connectionRetryCount = 0;
const MAX_RETRIES = 3;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.NEXT_MONGODB_URI;

  if (!mongoUri) {
    throw new Error("NEXT_MONGODB_URI environment variable is not defined");
  }

  try {
    // Add connection options to improve reliability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
    };

    // Try to connect to the database
    const db = await mongoose.connect(mongoUri, options);
    isConnected = db.connections[0].readyState === 1;
    connectionRetryCount = 0; // Reset retry count on successful connection
    console.log("MongoDB connected successfully");
  } catch (error) {
    connectionRetryCount++;
    console.error(
      `MongoDB connection attempt ${connectionRetryCount} failed:`,
      error.message
    );

    // If we've tried too many times, throw the error
    if (connectionRetryCount >= MAX_RETRIES) {
      console.error("Maximum MongoDB connection retry attempts reached");
      throw error;
    }

    // Small delay before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return connectToDatabase(); // Retry connection
  }
};

// Add a function to use a mock database when DB connection fails
export const getDataOrMock = async (modelFn, mockData, findOptions = {}) => {
  try {
    await connectToDatabase();
    return await modelFn(findOptions);
  } catch (error) {
    console.warn("Falling back to mock data due to database connection error");
    return mockData;
  }
};
