// server.js
// todo app backend

// init project
const express = require('express');
require('dotenv').config();
const bodyParser  = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const todoRoutes = express.Router();
const app = express();
var Todo = require('./todomodel');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());



mongoose.connect(process.env.MONGO_URI)
.then(
  () => {
    console.log("mongo opened")
    
  },
  err => {
    console.error("### error starting mongo")
    console.error(err)
  }
);




todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/delete/:id').get(function (req, res) {
    Todo.findByIdAndRemove(req.params.id, function(err, todo){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

app.use('/todos', todoRoutes);

const listener = app.listen(3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
