const express = require('express');
const mongoose = require('mongoose');
const table = require('./models/table');
const app = express();

app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');

// Retrieve 
app.get('/', async (req, res) => {
  try {
    const tasks = await table.find({});
    res.render('index', { tasks });
  } catch (error) {
    console.error('Error fetching tasks from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete 
app.post('/delete', async (req, res) => {
  try {
    const { taskId } = req.body;
    const deletedTask = await table.deleteOne({ _id: taskId });

    if (deletedTask.deletedCount === 1) {
     
      res.json({ message: 'Task deleted successfully' });
    } else {
     
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.use(express.urlencoded({ extended: true }));

//Insert
app.post('/tasks', async (req, res) => {
  try {
    
    await table.create({ Task: req.body.content });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating task in MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
