"use server";

import * as mongoose from "mongoose";
declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI!;
// const MONGODB_URI="mongodb+srv://assesssmenttool:Biometrics123@assessmenttool.gwbl6jn.mongodb.net/?retryWrites=true&w=majority"

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    
    // cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
    //   return mongoose;
    // });

    try {
      mongoose.connect(MONGODB_URI);
      const connection = mongoose.connection;

      connection.on('connected', () => {
          console.log('MongoDB connected successfully');
      })

      connection.on('error', (err) => {
          console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
          process.exit();
      })

  } catch (error) {
      console.log('Something goes wrong!');
      console.log(error);
  }
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;