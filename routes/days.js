const app = require('express').Router();
const db = require('../db');
const { Day, Hotel, Restaurant, Activity, Place } = db.models;

app.get('/', (req, res, next) => {
  Day.findAll({
    order: ['id'],
    include: [
      { model: Hotel, include: [Place] },
      { model: Restaurant, include: [Place] },
      { model: Activity, include: [Place] }
    ]
  })
    .then(days => {
      res.send(days);
    })
    .catch(next);
});

app.post('/', (req, res, next) => {
  Day.create({})
    .then(day => {
      res.send(day);
    });
});

app.delete('/:id', (req, res, next) => {
  Day.destroy({ where: { id: req.params.id } })
    .then(res.send())
});

//TO DO - total of six routes, add and remove hotels, restaurants, activities for a day

app.post('/:dayId/:key/:id', (req, res, next) => {
  let day;
  Day.findById(req.params.dayId)
    .then(_day => {
      day = _day

      className = req.params.key.substring(0, req.params.key.length - 1)
      className = className.charAt(0).toUpperCase() + className.slice(1)
      if (className === 'Activitie') className = 'Activity'
      eval(className).findById(req.params.id)
        .then(place => {
          eval(`day.add${ className }(place)`)
          res.send()
        })
    })
});

app.delete('/:dayId/:key/:id', (req, res, next) => {
  let day;
  Day.findById(req.params.dayId)
    .then(_day => {
      day = _day

      className = req.params.key.substring(0, req.params.key.length - 1)
      className = className.charAt(0).toUpperCase() + className.slice(1)
      if (className === 'Activitie') className = 'Activity'
      eval(className).findById(req.params.id)
        .then(place => {
          eval(`day.remove${ className }(place)`)
          res.send()
        })
    })
});

module.exports = app;
