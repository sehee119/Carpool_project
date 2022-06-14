const fs = require('fs');
const { Client } = require('pg');
const router = require('express').Router();

const { getGeo } = require('../NCP/getGeo.js');
const { transGeo } = require('../NCP/transGeo.js');
const { makeMarker } = require('../NCP/makeMarker.js');

router.get('/', (req, res) => {
  var start = function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(transGeo(req.query.start_name));
      }, 1000);
    }).then(function (result) {
      return getGeo(result);
    });
  };

  var goal = function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(transGeo(req.query.goal_name));
      }, 1000);
    }).then(function (result) {
      return getGeo(result);
    });
  };

  if (req.query.stops1_place) {
    var stops1 = function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(transGeo(req.query.stops1_place));
        }, 1000);
      }).then(function (result) {
        return getGeo(result);
      });
    };
  }
  if (req.query.stops2_place) {
    var stops2 = function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(transGeo(req.query.stops2_place));
        }, 1000);
      }).then(function (result) {
        return getGeo(result);
      });
    };
  }

  async function route() {
    let a = await start();
    let b = await goal();
    if (req.query.stops1_place) {
      let c = await stops1();
      if (req.query.stops2_place) {
        let d = await stops2();
        return makeMarker(a, b, c, d);
      }
      return makeMarker(a, b, c);
    }
    return makeMarker(a, b);
  }

  if (req.query.stops2_place) {
    var cnt = 4;
  } else {
    if (req.query.stops1_place) {
      var cnt = 3;
    } else {
      var cnt = 2;
    }
  }

  if (cnt == 4) {
    Promise.all([cnt, start(), goal(), stops1(), stops2(), route()]).then(
      function (values) {
        //console.log("모두 완료됨", values);
        res.render('map', {
          xy: values,
        });
      }
    );
  } else if (cnt == 3) {
    Promise.all([cnt, start(), goal(), stops1(), route()]).then(function (
      values
    ) {
      //console.log("모두 완료됨", values);
      res.render('map', {
        xy: values,
      });
    });
  } else if (cnt == 2) {
    Promise.all([cnt, start(), goal(), route()]).then(function (values) {
      //console.log("모두 완료됨", values);
      res.render('map', {
        xy: values,
      });
    });
  }
});

module.exports = router;
