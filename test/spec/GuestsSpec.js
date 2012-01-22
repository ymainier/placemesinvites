describe('Guests', function () {
  it('initially contain no Guest', function () {
    var g = new Guests();
    expect(g.length()).toBe(0);
  });

  describe('A Guest', function () {
    it('can be added', function () {
      var g = new Guests();
      var anotherGuest = new Guest('Another Guest');

      // simple add
      g.add('A Guest').add('Another Guest', 1).add(anotherGuest);

      expect(g.length()).toBe(3);
    });

    it('can be remove', function () {
      var g = new Guests();

      g.add('Guest1').add('Guest2').remove('Guest2').remove('Guest1');

      expect(g.length()).toBe(0);
    });

    it('can be found by its name', function () {
      var g = new Guests(), g2;

      g.add('g1').add('g2').add('g3');
      g2 = g.get('g2');

      expect(g2.name).toBe('g2');

      expect(g.get('doesnotexit')).toBe(undefined);
    });
  });

  it('can be mass assigned', function () {
    var group1 = new Guests();
    var group2 = new Guests();
    var group3 = new Guests();

    group1.add(['g11', 'g12']);
    expect(group1.length()).toBe(2);
    expect(group1.get('g11').quantity).toBe(Guest.DEFAULT_QUANTITY);
    expect(group1.get('g12').quantity).toBe(Guest.DEFAULT_QUANTITY);

    group2.add([{name: 'g21', quantity: 1}, {name: 'g22', quantity: 3}]);
    expect(group2.length()).toBe(2);
    expect(group2.get('g21').quantity).toBe(1);
    expect(group2.get('g22').quantity).toBe(3);

    group3.add([new Guest('g31'), new Guest('g32', 1)]);
    expect(group3.length()).toBe(2);
    expect(group3.get('g31').quantity).toBe(Guest.DEFAULT_QUANTITY);
    expect(group3.get('g32').quantity).toBe(1);
  });

  it('can be iterated', function () {
    var names = [];
    var totalQuantity = 0;
    var g = new Guests();

    g.add(['g1', {name: 'g2', quantity:1}, 'g3']).each(function (guest) {
      names.push(guest.name);
      totalQuantity += guest.quantity;
    });

    expect(names.join('')).toBe('g1g2g3');
    expect(totalQuantity).toBe(2 * Guest.DEFAULT_QUANTITY + 1);
  });

  it('can be reduced', function () {
    var g = new Guests();
    g.add(['1', '2']);

    expect(g.reduce(function (qt, guest) {
      return qt + guest.quantity;
    }, 0)).toBe(4);
  });

  it('can give their total number', function () {
    var group = new Guests();
    group.add(['g1', 'g2', new Guest('g3', 3), {name: 'g4', quantity: 4}]);

    expect(group.totalQuantity()).toBe(11);
  });

  it('can be emptied', function () {
    var guests = new Guests();
    guests.add(['1', '2', '3', '4']);
    expect(guests.totalQuantity()).toBe(8);
    guests.empty();
    expect(guests.totalQuantity()).toBe(0);
  });

  it('can be cloned', function () {
    var g1 = new Guests(), g2;
    g1.add(['1', '2']);

    g2 = g1.clone();

    expect(g1.guests).not.toBe(g2.guests);
    expect(g1.guests).toEqual(g2.guests);
  });
});
