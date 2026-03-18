const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const usersRouter = require('./routes/users');
const problemsRouter = require('./routes/problems');
const tasksRouter = require('./routes/tasks');
const metricsRouter = require('./routes/metrics');
const journalRouter = require('./routes/journal');
const examsRouter = require('./routes/exams');

app.use('/users', usersRouter);
app.use('/problems', problemsRouter);
app.use('/tasks', tasksRouter);
app.use('/metrics', metricsRouter);
app.use('/journal', journalRouter);
app.use('/exams', examsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
