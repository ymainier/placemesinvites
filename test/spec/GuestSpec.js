describe('Guest', function () {
  it('has a name and is a duo by default', function () {
    var g = new Guest('Guest');
    expect(g.name).toBe('Guest');
    expect(g.quantity).toBe(2);
  });

  it('can be single', function () {
    var g = new Guest('Guest', 1);
    expect(g.name).toBe('Guest');
    expect(g.quantity).toBe(1);
  });
});
