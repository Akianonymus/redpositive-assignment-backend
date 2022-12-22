const bodyParser = require("body-parser");
const express = require("express");
const app = express();

require("dotenv").config();

// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");

// execute database connection
dbConnect();

// Handle CORS Error by adding a header here
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_, response, next) => {
  response.json({
    message: "My Full Stack Assignment app backend!",
  });
  next();
});

// to fetch all users from the db
app.get("/users", (_, response) => {
  User.find({}, (error, users) => {
    if (error) return response.status(500).send(error);

    let total_users = users.length;
    response.status(200).send({
      total_users,
      users,
    });
  });
});

// create new user
app.post("/new", (request, response) => {
  let { username, phone, email, hobbies } = request.body;

  const user = new User({ username, phone, email, hobbies });

  // save the new user
  user
    .save()
    // return success if the new user is added to the database successfully
    .then((result) => {
      response.status(201).send({
        message: "User Created Successfully",
        result,
      });
    })
    // catch error if the new user wasn't added successfully to the database
    .catch((error) => {
      if (error?.keyValue?.username === username) {
        response.status(409).send({
          message: `User ${username} already exists`,
        });
      } else {
        response.status(500).send({
          message: "Error creating user",
          error,
        });
      }
    });
});

// update user
app.put("/update/:id", (request, response) => {
  const id = request.params.id;
  const { username, phone, email, hobbies } = request.body;
  // update the given user

  User.findByIdAndUpdate(id, { username, phone, email, hobbies })
    .then((_) => {
      response.status(200).send({
        message: "User updated Successfully",
        content: request.body.content,
        id,
      });
    })
    .catch((error) => {
      if (error?.keyValue?.username === username) {
        response.status(409).send({
          message: `User ${username} already exists`,
        });
      } else {
        response.status(500).send({
          message: "Error updating user",
          error,
        });
      }
    });
});

// delete user
app.delete("/delete/:id", (request, response) => {
  const id = request.params.id;
  // delete the given user and update it
  User.findByIdAndRemove(id, (error) => {
    if (error)
      return response.status(500).send({
        message: "Error deleting user",
        error,
      });

    response.status(200).send({
      message: "User deleted Successfully",
    });
  });
});

// batch delete users
app.delete("/batchdelete", (request, response) => {
  const { ids } = request.body;
  User.deleteMany({ _id: { $in: ids } })
    .then((result) => {
      response.status(200).send({
        message: "All given Users deleted Successfully",
        deleteCount: result?.deletedCount,
      });
    })
    .catch((error) => {
      return response.status(500).send({
        message: "Error deleting given Users.",
        error,
      });
    });
});

// delete all users
app.delete("/deleteall", (_, response) => {
  User.deleteMany({}, (error) => {
    if (error)
      return response.status(500).send({
        message: "Error deleting all Users.",
        error,
      });

    response.status(200).send({
      message: "All Users deleted Successfully",
    });
  });
});

module.exports = app;
