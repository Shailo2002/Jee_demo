import express from "express";
import testRoutes from "./routes/tests.js";
import analyticsRoutes from "./routes/analytics.js";

const app = express();

app.use("/api/tests", testRoutes);
app.use("/api/analytics", analyticsRoutes);

// ... rest of the code ... 