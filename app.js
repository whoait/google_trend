import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';
import googleTrends  from  'google-trends-api';


// Set up the express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// get google_trend_data
app.get('/api/v1/google_trend_data/:keyword', (req, res) => {
  var keyword = req.params.keyword;
  var time = new Date();
  var time_last_year = time.setFullYear(time.getFullYear()-1);
  console.log(new Date(time_last_year));
  googleTrends.interestOverTime({keyword: keyword, geo: 'SG', startTime: new Date(time_last_year), endTime: new Date(), })
  .then(function(results){
    res.status(200).send({
      success: 'true',
      message: 'todos retrieved successfully',
      data: JSON.parse(results)
    })
  })
  .catch(function(err){
    console.error('Oh no there was an error', err);
  });
  
});

app.post('/api/v1/todos', (req, res) => {
  if(!req.body.title) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required'
    });
  } else if(!req.body.description) {
    return res.status(400).send({
      success: 'false',
      message: 'description is required'
    });
  }
 const todo = {
   id: db.length + 1,
   title: req.body.title,
   description: req.body.description
 }
 db.push(todo);
 return res.status(201).send({
   success: 'true',
   message: 'todo added successfully',
   todo
 })
});

app.get('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.map((todo) => {
    if (todo.id === id) {
      return res.status(200).send({
        success: 'true',
        message: 'todo retrieved successfully',
        todo,
      });
    } 
});
 return res.status(404).send({
   success: 'false',
   message: 'todo does not exist',
  });
});

app.delete('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  db.map((todo, index) => {
    if (todo.id === id) {
       db.splice(index, 1);
       return res.status(200).send({
         success: 'true',
         message: 'Todo deleted successfuly',
       });
    }
  });

  return res.status(404).send({
    success: 'false',
    message: 'todo not found',
  });

 
});


app.put('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let todoFound;
  let itemIndex;
  db.map((todo, index) => {
    if (todo.id === id) {
      todoFound = todo;
      itemIndex = index;
    }
  });

  if (!todoFound) {
    return res.status(404).send({
      success: 'false',
      message: 'todo not found',
    });
  }

  if (!req.body.title) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required',
    });
  } else if (!req.body.description) {
    return res.status(400).send({
      success: 'false',
      message: 'description is required',
    });
  }

  const updatedTodo = {
    id: todoFound.id,
    title: req.body.title || todoFound.title,
    description: req.body.description || todoFound.description,
  };

  db.splice(itemIndex, 1, updatedTodo);

  return res.status(201).send({
    success: 'true',
    message: 'todo added successfully',
    updatedTodo,
  });
});



const PORT = 5000;

app.listen(process.env.PORT || 5000, () => {
  console.log(`server running on port ${PORT}`)
});
