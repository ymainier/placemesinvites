describe('Affinities', function () {
  function expectMutualAffinityScore(affinity, someone, someoneElse, affinityLevel) {
    expect(affinity.score(someone, someoneElse)).toBe(affinityLevel);
    expect(affinity.score(someoneElse, someone)).toBe(affinityLevel);
  }

  it('someone and someoneElse can like, couldLike, couldDislike and dislike each other', function () {
    var a = new Affinities();

    a.like('someone', 'someoneElse');
    expectMutualAffinityScore(a, 'someone', 'someoneElse', Affinities.level.LIKE);
    a.couldLike('someone', 'someoneElse');
    expectMutualAffinityScore(a, 'someone', 'someoneElse', Affinities.level.COULD_LIKE);
    a.couldDislike('someone', 'someoneElse');
    expectMutualAffinityScore(a, 'someone', 'someoneElse', Affinities.level.COULD_DISLIKE);
    a.dislike('someone', 'someoneElse');
    expectMutualAffinityScore(a, 'someone', 'someoneElse', Affinities.level.DISLIKE);
  });

  it('affinity statements can be chained', function () {
    var a = new Affinities();

    a.like('g1', 'g2').like('g3', 'g4');
    expectMutualAffinityScore(a, 'g1', 'g2', Affinities.level.LIKE);
    expectMutualAffinityScore(a, 'g3', 'g4', Affinities.level.LIKE);
  });

  it('someone with no affinity is neutral with anyone', function () {
    var a = new Affinities();

    expect(a.score('someone with no affinity', 'anyone')).toBe(Affinities.level.NEUTRAL);
  });

  it('scores can be set and retrieve for guests', function () {
    var a = new Affinities();
    var g1 = new Guest('g1');
    var g2 = new Guest('g2');

    a.like(g1, g2);
    expectMutualAffinityScore(a, 'g1', 'g2', Affinities.level.LIKE);
    expectMutualAffinityScore(a, g1, g2, Affinities.level.LIKE);
  });

  it('everyone is neutral with itself', function () {
    var a = new Affinities();
    expect(a.score('me', 'me')).toBe(Affinities.level.NEUTRAL);
  });

  it('someone can get the sum of its score for a list other people', function () {
    var a = new Affinities();
    var group = new Guests();

    group.add(['a', 'b']);
    a.like('someone', 'a').couldDislike('someone', 'b');

    expect(a.score('someone', group)).toBe(Affinities.level.LIKE + Affinities.level.COULD_DISLIKE);
  });

  it('can get the score of a table', function () {
    var t = new Table();
    var a = new Affinities();

    t.add('a');
    t.add('b');
    t.add('c');
    t.add('d');
    a.like('a', 'b').couldLike('a', 'c').couldDislike('b', 'd');

    expect(a.tableScore(t)).toBe(Affinities.level.LIKE * 2 + Affinities.level.COULD_LIKE * 2 + Affinities.level.COULD_DISLIKE * 2);
  });

  it('can get the score of several tables', function () {
    var ts = new Tables(4, 8);
    var a = new Affinities();

    ts.tables[0].add('a');
    ts.tables[0].add('b');
    ts.tables[0].add('c');
    ts.tables[0].add('d');
    ts.tables[1].add('e');
    ts.tables[1].add('f');
    a.like('a', 'b').couldLike('a', 'c').couldDislike('b', 'd').dislike('e', 'f');

    expect(a.tablesScore(ts)).toBe(Affinities.level.LIKE * 2 + Affinities.level.COULD_LIKE * 2 + Affinities.level.COULD_DISLIKE * 2 + Affinities.level.DISLIKE * 2);

  });
});
