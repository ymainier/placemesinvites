var reception, t, maxScore;

console.time('init');

reception = new Reception(10, 8);
t = reception.tables.tables;

reception.guests.add([
  "p1", "p2", "p3", "p4",
  "p5", "p6", "p7", "p8",
  "p9", "p10", "p11", "p12",
  "p13", "p14", "p15", "p16",
  "p17", "p18", "p19", "p20",
  "p21", "p22", "p23", "p24",
  "p25", "p26", "p27", "p28",
  "p29", "p30", "p31",
  {name: "p32", quantity: 1},
  {name: "p33", quantity: 1},
  {name: "p34", quantity: 1},
  {name: "p35", quantity: 1},
  {name: "p36", quantity: 1},
  {name: "p37", quantity: 1},
  {name: "p38", quantity: 1},
  {name: "p39", quantity: 1},
  {name: "p40", quantity: 1}
]);

reception.affinities.
  dislike('p2', 'p1').
  dislike('p35', 'p39').
  dislike('p20', 'p39').
  dislike('p20', 'p40').
  like("p26", "p27").
  like("p26", "p28").
  like('p27', 'p28').
  like("p29", 'p30').
  like("p30", "p31").
  like('p29', 'p31').
  like('p4', 'p33').
  like('p33', 'p35').
  like('p36', 'p35').
  like('p18', 'p21').
  like('p38', 'p36').
  couldLike('p2', 'p23').
  // couldLike('p13', 'p23').
  couldLike('p5', 'p1').
  couldLike('p9', 'p17').
  couldLike('p9', 'p13').
  couldLike('p25', 'p26').
  couldLike('p7', 'p34').
  couldLike('p40', 'p39').
  couldLike('p37', 'p2').
  like('p32', 'p3').
  couldLike('p24', 'p8').
  couldLike('p22', 'p35').  
  couldLike('p20', 'p12').
  couldLike('p19', 'p16').
  couldLike('p15', 'p10').
  couldLike('p11', 'p14').
  couldDislike('p13', 'p15');

console.timeEnd('init');

console.time('first placement');

// // Place lover first :p
// reception.guests.sortBy(function (g) {
//   var love = 0;
//   _.each(reception.affinities.people[g.name], function (val) {
//     if(val > 0) {
//      love += val;
//     }
//   });
//   return love;
// });
reception.guests.shuffle();

reception.tables.empty();
reception.placeAllGuests();
maxScore = reception.score();

console.timeEnd('first placement');
console.log(reception.score(), reception.tables.toString());

console.time('50 rounds');
countDownOnTimeout(50, function (i) {
  var score;
  console.log(i);
  reception.guests.shuffle();
  reception.exchangeRound();
  score = reception.score();
  if (score > maxScore) {
    maxScore = score;
  }
}, function () {
  console.timeEnd('50 rounds');
  console.log(reception.score(), reception.tables.toString());
});

function countDownOnTimeout(n, iterator, after, context) {
  if (n > 0) {
    setTimeout(function () {
      iterator.call(context, n);
      n--;
      countDownOnTimeout(n, iterator, after, context);
    }, 0);
  } else {
    after.call(context);
  }
};

