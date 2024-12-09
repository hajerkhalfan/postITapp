import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/PostModel.js";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";



dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

//Database connection
const URI =`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@postitcluster.2gbtq.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&appName=PostITCluster`;

mongoose.connect(URI);
app.listen(process.env.PORT, () => {
  console.log("You are connected");
});

const __filename = fileURLToPath(import.meta.url);


const __dirname = dirname(__filename);

app.use("/uploads", express.static(__dirname + "/uploads"));


// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
// Create multer instance
const upload = multer({ storage: storage });


//PUT API - likePost
app.put("/likePost/:postId/", async (req, res) => {
const postId = req.params.postId;
const userId = req.body.userId;
  try {
  //search the postId if it exists
  const postToUpdate = await PostModel.findOne({ _id: postId });
  if (!postToUpdate) {
    return res.status(404).json({ msg: "Post not found." });
  }
  //Search the user Id from the array of users who liked the post.
  const userIndex = postToUpdate.likes.users.indexOf(userId);
  //indexOf method returns the index of the first occurrence of a specified value in an array.
  //If the value is not found, it returns -1.
  //This code will toogle from like to unlike
  if (userIndex !== -1) {
    // User has already liked the post, so unlike it
    const udpatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $inc: { "likes.count": -1 }, // Decrement the like count $inc and $pull are update operators
        $pull: { "likes.users": userId }, // Remove userId from the users array
      },
      { new: true } // Return the modified document
    );

    res.json({ post: udpatedPost, msg: "Post unliked." });
  } else {
    // User hasn't liked the post, so like it
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $inc: { "likes.count": 1 }, // Increment the like count
        $addToSet: { "likes.users": userId }, // Add userId to the users array if not already present
      },
      { new: true } // Return the modified document
    );

    res.json({ post: updatedPost, msg: "Post liked." });
  }
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "An error occurred" });
}
});

app.put("/likePost/:postId/", async (req, res) => {
  const postId = req.params.postId; //Extract the ID of the post from the URL
  const userId = req.body.userId;
  try {
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/registerUser", async(req, res) => {
  try{
    const user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })

    await user.save();
    res.send({user:user, msg:"Document saved successfully"})

  }
  catch(error) {
    console.error(error);
    res.status(500).json({error:"An unexpected error occurred"})

  }


})

//Express route for login

app.post("/login", async (req, res) => { 
  try { 
    const { email, password } = req.body;
  
    const user = await UserModel.findOne({ email: email });

    if (!user) { 
      res.status(500).send({ msg: " Couldn't find the user" });
      
    }
    else if (user.password !== password) {
      res.status(500).json({ msg: "Password is incorrect" });
      
    }
    else {
      res.send({user: user,msg:"Authentication is  successfull"})
    }
  }
  catch (error) { 
    res.status(500).json({error:"An unexpected error occurred"})
  }
})

app.post("/logout", async (req, res) => {
  res.send({ msg: "logout successful" })
 })

 app.post("/savePost", async (req, res) => {
  try {
    const postMsg = req.body.postMsg;
    const email = req.body.email;

    const post = new PostModel({
      postMsg: postMsg,
      email: email,
    });

    await post.save();
    res.send({ post: post, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/getPosts", async (req, res) => {
  try {
    // Fetch all posts from the "PostModel" collection, sorted by createdAt in descending order
    const posts = await PostModel.find({}).sort({ createdAt: -1 });

    const countPost = await PostModel.countDocuments({});

    res.send({ posts: posts, count: countPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" })
  }
  });



app.put("/updateUserProfile/:email/", async (req, res) => {
    //Retrieve the value from the route
    const email = req.params.email;
    //Retrieve the values from the request body.
    const name = req.body.name;
    const password = req.body.password;
  
    try {
      // Search for the user that will be updated using the findOne method
      const userToUpdate = await UserModel.findOne({ email: email });
  
      // Check if the user was found
      if (!userToUpdate) {
        return res.status(500).json({ error: "User not found" });
      }
  
      // Update the user's name
      userToUpdate.name = name;
  
      //if the user changed the password, change the password in the Db to the new hashed password
      if (password !== userToUpdate.password) {
        const hashedpassword = await bcrypt.hash(password, 10);
        userToUpdate.password = hashedpassword;
      } else {
        //if the user did not change the password
        userToUpdate.password = password;
      }
  
      // Save the updated user
      await userToUpdate.save(); // Make sure to save the changes
  
      // Return the updated user as a response
      res.send({ user: userToUpdate, msg: "Updated." });

        
      
    } catch (err) {
      // Handle errors, including database or validation issues
      res.status(500).json({ error: err.message }); // Send a more descriptive error message
    }
  });


  app.put(
    "/updateUserProfile/:email/",
    upload.single("profilePic"), // Middleware to handle single file upload
    async (req, res) => {
      const email = req.params.email;
      const name = req.body.name;
      const password = req.body.password;
  
      try {
        // Find the user by email in the database
        const userToUpdate = await UserModel.findOne({ email: email });
  
        // If the user is not found, return a 404 error
        if (!userToUpdate) {
          return res.status(404).json({ error: "User not found" });
        }
        // Check if a file was uploaded and get the filename
        let profilePic = null;
        if (req.file) {
          profilePic = req.file.filename; // Filename of uploaded file
          // Update profile picture if a new one was uploaded but delete first the old image
          if (userToUpdate.profilePic) {
            const oldFilePath = path.join(
              __dirname,
              "uploads",
              userToUpdate.profilePic
            );
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.error("Error deleting file:", err);
              } else {
                console.log("Old file deleted successfully");
              }
            });
            userToUpdate.profilePic = profilePic; // Set new profile picture path
          }
        } else {
          console.log("No file uploaded");
        }
  
        // Update user's name
        userToUpdate.name = name;
  
        // Hash the new password and update if it has changed
        if (password !== userToUpdate.password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          userToUpdate.password = hashedPassword;
        } else {
          userToUpdate.password = password; // Keep the same password if unchanged
        }
  
          // Save the updated user information to the database
        await userToUpdate.save();
  
        // Send the updated user data and a success message as a response
        res.send({ user: userToUpdate, msg: "Updated." });
      } catch (err) {
        // Handle any errors during the update process
        res.status(500).json({ error: err.message });
      }
    }
  );  


