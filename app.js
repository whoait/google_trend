import express from 'express';
import bodyParser from 'body-parser';
import googleTrends  from  'google-trends-api';


// Set up the express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// get google_trend_data
app.get('/api/v1/google_trend_data/:keyword/:geo', (req, res) => {
  var keyword = req.params.keyword;
  var geo = req.params.geo;
  var time = new Date();
  var time_last_year = time.setFullYear(time.getFullYear()-1);
  console.log(new Date(time_last_year));
  console.log(geo)
  googleTrends.interestOverTime({keyword: keyword, geo: geo , startTime: new Date(time_last_year), endTime: new Date(), })
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

const PORT = 5000;

app.listen(process.env.PORT || 5000, () => {
  console.log(`server running on port ${PORT}`)
});
