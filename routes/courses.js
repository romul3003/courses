const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

// get request courses
router.get("/", async (req, res) => {
  // get all courses from db
  const courses = await Course.find()

  res.render("courses", {
    title: "Courses",
    isCourses: true,
    courses,
  });
});


// edit route
router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  const course = await Course.findById(req.params.id);

  res.render("course-edit", {
    title: `Edit ${course.title}`,
    course,
  });
});

router.post('/edit', async (req, res) => {
  const { id } = req.body
  delete req.body.id
  await Course.findByIdAndUpdate(id, req.body)
  res.redirect('/courses')
})

// delete course
router.post('/remove', async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id })
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

// dynamic routes to selected course
router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("course", {
    layout: "empty",
    title: `Course ${course.title}`,
    course,
  });
});

module.exports = router;
