var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var user = require("../models/user");
var contact = require("../models/contact");
var moment = require("moment");

/* GET home page. */
router.get("/", middleware.isLoggedIn, async function (req, res) {
  const totalInquiry = await contact.countDocuments({});
  const totalRead = await contact.countDocuments({ isRead: true });
  const totalUnread = await contact.countDocuments({
    isRead: false,
  });

  const counts = {
    totalInquiry,
    totalRead,
    totalUnread,
  };
  res.render("dashboard", { data: counts });
});

router.get("/profile", middleware.isLoggedIn, function (req, res) {
  res.render("profile");
});

router.get("/usercrud", middleware.isLoggedIn, function (req, res) {
  user.find({}, (err, data) => {
    if (err) {
      res.redirect("/usercrud");
    } else {
      res.render("usercrud", { data: data });
    }
  });
});

router.post("/contact", async function (req, res) {
  try {
    if (process.env.X_API_KEY !== req.headers["x-api-key"]) {
      res.status(400).send("Invalid API_KEY");
      return;
    }

    var newContact = new contact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      notes: req.body.notes,
      createdAt: moment().unix(),
    });
    const saveContact = await newContact.save();
    res.status(200).send("Contact saved successfully");

    return "ok";
  } catch (err) {
    console.log("err", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/contact", middleware.isLoggedIn, function (req, res) {
  contact.find({}, (err, data) => {
    if (err) {
      res.redirect("/contact");
    } else {
      res.render("contact", { data: data });
    }
  });
});

router.post("/change-status/:id", async function (req, res) {
  try {
    const findContact = await contact.findOne({ _id: req.params.id });
    if (!findContact) {
      res.status(404).send("Contact not found");
      return; // Add return statement to exit the function
    }
    findContact.isRead = req.body.isRead;
    await findContact.save();

    // Redirect to the "/contact" page after updating the contact
    res.redirect("/contact");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/contact", middleware.isLoggedIn, function (req, res) {
  contact.find({}, (err, data) => {
    if (err) {
      res.redirect("/contact");
    } else {
      res.render("contact", { data: data });
    }
  });
});

module.exports = router;
