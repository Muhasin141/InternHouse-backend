const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

const { initializeDatabase } = require("./database/db.connect");
const Job = require("./models/job.model");
const jobsData = require("./jobs.json");

// CORS Setup
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// ===============================
// Initialize DB and Start Server
// ===============================
initializeDatabase().then(async () => {
  await seedJobData();   // 🔥 CALL SEED HERE

  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
  });
});




// ===============================
// Routes
// ===============================

// Get all jobs
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// Get single job
app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job" });
  }
});

// Add new job
app.post("/jobs", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: "Error creating job" });
  }
});

// Delete job
app.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
});


