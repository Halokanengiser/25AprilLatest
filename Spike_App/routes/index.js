const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs'); // To read the JSON file


// Assuming you have already initialized and configured express-openid-connect middleware.
// Make sure you have something like the following in your app setup:
// const { auth } = require('express-openid-connect');
// app.use(auth({...options}));

// Static files setup
router.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'Dummy_Database' directory
router.use('/Dummy_Database', express.static(path.join(__dirname, '..', '..', 'Dummy_Database')));

router.get('/', (req, res) => {
  // Check if the user is authenticated
  const isAuthenticated = req.oidc.isAuthenticated();

  if (isAuthenticated) {
    // Check if user object exists before accessing its properties
    const userName = req.oidc.user ? req.oidc.user.name : 'Unknown User';
    console.log('User is authenticated:', userName);
    res.render('home', {
      title: 'Home',
      isAuthenticated: true,
      userName: userName
    });
  } else {
    console.log('User is not authenticated');
    res.render('home', {
      title: 'Home',
      isAuthenticated: false,
      userName: null
    });
  }
});

// Path: Auth0/views/home.ejs

// New route for drill_library page
router.get('/drill_library', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();

  // Read the drills data from the JSON file
  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_drills.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading drill data");
      return;
    }

    const drills = JSON.parse(data);
    res.render("drill_library", {
      title: 'Drill Library',
      isAuthenticated,
      userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
      drills
    }); // Pass the drills to the EJS template
  });
});

// import { expandDrill } from '../public/js/expand_drill.js'; // Assuming 'expand_drill.js' is in the same directory

// Path: Auth0/views/drill_library.ejs


// New route for practice_plan page
router.get('/practice_plans', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();

  // Read the practice plan data from the JSON file
  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading practice plan data");
      return;
    }

    const practicePlans = JSON.parse(data).practice_plans;
    if (isAuthenticated) {
      // Check if user object exists before accessing its properties
      const userName = req.oidc.user ? req.oidc.user.name : 'Unknown User';
      console.log('User is authenticated:', userName);
      res.render('practice_plans', {
        title: 'Practice Plans',
        isAuthenticated: true,
        userName: userName,
        practicePlans: practicePlans,
        numOfPlans: practicePlans.length
      });
    } else {
      res.redirect('/login/');
    }
  });
});

// Path: Auth0/views/practice_plans.ejs

// Route for create_drill page
router.get('/create_drill', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();

  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_drills.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading practice plan data");
    }

    const drills = JSON.parse(data);
    const newDrillID = drills.length + 1;
    console.log('New Drill ID:', newDrillID);

    if (isAuthenticated) {
      res.render("create_drill", {
        title: 'Create Drill',
        isAuthenticated,
        userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
        newDrillID
      });
    } else {
      res.redirect('/login/');
    }
  });
});


// Path: Auth0/views/create_drill.ejs

// Route for create_plan page
router.get('/create_plan', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();

  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading practice plan data");
      return;
    }

    const practicePlans = JSON.parse(data).practice_plans;
    const usedPlans = practicePlans.length;

    if (isAuthenticated) {
      res.render("create_plan", {
        title: 'Create Plan',
        isAuthenticated,
        userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
        usedPlans
      });
    } else {
      res.redirect('/login/');
    }
  });
});

// Path: Auth0/views/create_plan.ejs



// Route for Adding Drills to a Plan
router.get('/drill_library:planNumber', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();


});




// New route to drill page
router.get('/drill_view/:drillId', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  const drillId = req.params.drillId; // Access the drillId from request parameters
  console.log('Drill ID:', drillId);
  var drill = {};

  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_drills.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading drill data");
      return;
    }

    const drills = JSON.parse(data); // data is undefined here, so you need to move this line inside the callback

    // THE CODE BELOW CAUSES AN ERROR
    // Find the drill with the matching drillId
    // const drill = drills.find(drill => drill.drillId === drillId);

    // if (!drill) {
    //   res.status(404).send("Drill not found");
    //   return;
    // }
    // THE CODE ABOVE CAUSES AN ERROR

    // // Using a loop
    for (let i = 0; i < drills.length; i++) {
      if (parseInt(drills[i].drillId) === parseInt(drillId)) {
        // Found the object with drillId equal to 1
        console.log("Found:", drills[i]);

        drill = drills[i];
        // Do whatever you need with the found object
        break; // Exit the loop since we found what we were looking for
      } else {
        console.log("Not found");
      }
    }

    res.render("drill_view", {
      title: 'Drill View',
      isAuthenticated,
      userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
      drillId, // Pass the drillId to the template
      drill
      // Add other drill details as needed
    });
  });
});


// Path: Auth0/views/drill_view.ejs


// Route to the share plan page
router.get('/share_plan/:planNumber', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  const plan_number = req.params.planNumber; // Access the plan number from request parameters

  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading practice plan data");
      return;
    }

    const practicePlans = JSON.parse(data).practice_plans;

    for (let i = 0; i < practicePlans.length; i++) {
      if (parseInt(practicePlans[i].plan_number) == parseInt(plan_number)) {
        // Found the object with planNumber equal to 1
        console.log("Found:", practicePlans[i]);

        plan = practicePlans[i];
        // Do whatever you need with the found object
        break; // Exit the loop since we found what we were looking for
      } else {
        console.log("Not found");
        console.log("Plan Number:", practicePlans[i].plan_number + " Of type: " + typeof practicePlans[i].plan_number);
        console.log("Plan Number:", plan_number + " Of type: " + typeof plan_number);
      }
    }

    if (isAuthenticated) {
      res.render("share_plan", {
        title: 'Share Plan',
        isAuthenticated,
        userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
        plan
      });
    } else {
      res.redirect('/login/');
    }
  });
});

// Path: Auth0/views/share_plan.ejs


// Route to the view plan page
router.get('/view_plan/:planNumber', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();

  // right now the plan number is returning the number and an image link for some reason, we need to fix that
  const plan_number = parseInt(req.params.planNumber); // Access the plan number from request parameters
  console.log('Plan Number:', plan_number);

  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading practice plan data");
      return;
    }

    const practicePlans = JSON.parse(data).practice_plans;
    let foundPlan = null;

    // Using a loop
    for (let i = 0; i < practicePlans.length; i++) {
      console.log(parseInt(practicePlans[i].plan_number) == parseInt(plan_number))
      if (parseInt(practicePlans[i].plan_number) == parseInt(plan_number)) {
        // Found the object with planNumber equal to 1
        console.log("Found:", practicePlans[i]);
        foundPlan = practicePlans[i];
        break; // Exit the loop since we found what we were looking for
      } else {
        console.log("Not found");
        console.log("Plan Number:", practicePlans[i].plan_number + " Of type: " + typeof practicePlans[i].plan_number);
        console.log("Plan Number:", plan_number + " Of type: " + typeof plan_number);
      }
    }

    if (foundPlan) {
      res.render("view_plan", {
        title: 'View Plan',
        isAuthenticated,
        userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
        plan_number, // Pass the plan number to the template
        plan: foundPlan
      });
    } else {
      // If the plan was not found, handle it accordingly
      console.log("Plan not found");
      res.status(404).send("Plan not found");
    }
  });
});

// Path: Auth0/views/view_plan.ejs

// Route to drill saved page
router.get('/drill_saved', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();

  if (isAuthenticated) {
    res.render("drill_saved", {
      title: 'Drill Saved',
      isAuthenticated,
      userName: req.oidc.user ? req.oidc.user.name : 'Unknown User'
    });
  } else {
    res.redirect('/login/');
  }
});

// Route to handle saving drill data
router.post('/save-drill', (req, res) => {
  const newDrillData = req.body;

  // Read the existing drills data from the JSON file
  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_drills.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading drill data");
      return;
    }

    const existingDrills = JSON.parse(data);

    // Append the new drill data to the existing drills array
    existingDrills.push(newDrillData);

    // Write the updated drills data back to the JSON file
    fs.writeFile(path.join(__dirname, "../../Dummy_Database/dummy_drills.json"), JSON.stringify(existingDrills, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving drill data");
        return;
      }

      // Respond with a success message
      res.render('drill_saved', {
        title: 'Drill Created Confirmation',
        isAuthenticated: req.oidc.isAuthenticated(),
        drillData: newDrillData
      });
    });
  });
});

// Path: Auth0/views/saved_drills.ejs

module.exports = router;