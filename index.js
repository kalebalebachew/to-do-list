const express = require('express');
const mongoose = require('mongoose');
const table = require('./models/table');
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://kalebalebachew4:0913029062@cluster0.rpzteas.mongodb.net/?authMechanism=SCRAM-SHA-1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');

const { swaggerUi, specs } = require('./swagger'); 



// Swagger documentation
app.use('/swagger', swaggerUi.serve);
app.get('/swagger', swaggerUi.setup(specs));

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Operations related to tasks
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal Server Error
 */

app.get('/', async (req, res) => {
  try {
    const tasks = await table.find({});
    res.status(200).send('Fetched succesfully');
  } catch (error) {
    console.error('Error fetching tasks from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * @swagger
 * /delete:
 *   post:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 */

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

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task created successfully
 *       500:
 *         description: Internal Server Error
 */

app.post('/create', async (req, res) => {
  try {
    await table.create({ Task: req.body.content });
    res.status(200).send('Created successfully');
  } catch (error) {
    console.error('Error creating task in MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});



/**
 * @swagger
 * /update:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *               newContent:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 */

app.put('/update', async (req, res) => {
  try {
    const { taskId, newContent } = req.body;
    const updatedTask = await table.findByIdAndUpdate(
      taskId,
      { Task: newContent },
      { new: true } // Return the updated document
    );

    if (updatedTask) {
      res.json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task in MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});





app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
