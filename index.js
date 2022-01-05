const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Student = require("./models/students");

const app = express();
const port = process.env.PORT || 8080;

//decode the data embeded inside request Body
app.use(express.urlencoded({ extended: true }));

//static Assets
app.use(express.static(path.join(__dirname, "public")));

//View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//mongoDB connection string
const connectionString =
  "mongodb+srv://noaman_saleem:nomibhai@cluster0.3y0uf.mongodb.net/lums?retryWrites=true&w=majority";

//Routes
app.get("/", (req, res) => {
  res.render("index");
});

//new student form route
app.get("/students/new", (req, res) => {
  res.render("students/new-student.ejs");
});

// app.get("/students", (req, res) => {
//   res.send("GET Reequest Data receieved");
// });

//CRUD
//Read all students
app.get("/students", async (req, res) => {
  const students = await Student.find();
  // console.log(students);
  res.render("students/all-students", { students });
});

//RENDER EDIT FORM
app.get("/students/:id/edit", async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id);
  res.render("students/edit-student", { student });
});

//SHOW DEATLS ROUTE
app.get("/students/:id", async (req, res) => {
  // const id = req.params.id;
  //ES6 Syntax
  //object destructruting
  const { id } = req.params;
  const student = await Student.findById(id);
  res.render("students/show-student", { student });
});

//Create new student
app.post("/students", async (req, res) => {
  //extract form data
  // console.log(req.body);
  const name = req.body.name;
  const age = req.body.age;
  const phone = req.body.phone;
  const address = req.body.address;
  //save the extracted data into my mongoDB database
  const student = new Student({
    name: name,
    age: age,
    phone: phone,
    address: address,
  });

  await student.save();

  res.redirect("/");
});

//UPDATE STUDENT
app.post("/students/:id/update", async (req, res) => {
  const { id } = req.params;
  const { name, age, address, phone } = req.body;
  await Student.findByIdAndUpdate(id, req.body);
  res.redirect("/students");
});

app.listen(port, () => {
  console.log(`Server listening at PORT: ${port}`);
});

mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`Connected to MongoDB`);
  })
  .catch((error) => {
    console.log(error.message);
  });
