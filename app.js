const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cluster = require("cluster");
const os = require("os");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const path = require('path'); 
const multerUpload = require('./src/config/multer');

dotenv.config();
const app = express();
const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 4500;

app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later.",
  })
);

connectDB();
const authRoutes = require('./src/routes/authRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', commentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

if (cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`);

  let workers = [];

  const forkWorker = () => {
    const worker = cluster.fork();
    workers.push(worker);
  };

  forkWorker();
  setInterval(() => {
    const loadPerCPU = os.loadavg()[0] / numCPUs;
    // console.log(
    //   `Current load per CPU: ${loadPerCPU.toFixed(2)} | Active Workers: ${
    //     workers.length
    //   }`
    // );

    if (loadPerCPU > 0.7 && workers.length < numCPUs) {
      console.log("High load detected. Forking a new worker...");
      forkWorker();
    } else if (loadPerCPU < 0.3 && workers.length > 1) {
      console.log("Low load detected. Removing a worker...");
      const worker = workers.pop();
      worker.kill();
    }
  }, 10000);
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    workers = workers.filter((w) => w.id !== worker.id);
    forkWorker();
  });
} else {
  app.listen(PORT, () =>
    console.log(`Worker ${process.pid} running on port ${PORT}`)
  );
}
