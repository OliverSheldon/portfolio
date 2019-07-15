const assert = require('assert');
let rewire = require('rewire');

let Compass = require('../public/js/lib/modules/userMedia/compass.js');
let geolocation = require('../public/js/lib/modules/userMedia/geolocation.js');

//north 0 deg
const movement1 = [53.000000, -2.000000 ,54.000000, -2.000000];
//north east
const movement2 = [53.000000, -2.000000 ,54.000000, -1.000000];
//south
const movement3 = [53.000000, -2.000000 ,52.000000, -2.000000];

describe('Compass getHeading',function testGetHeading(){
    let c = new Compass();

    c.setHeading(movement1);
    let heading1 = c.getHeading();
    it('heading should be 0 or 360 (north)', function () {
        assert.equal(heading1,0 || 360);
    });

    c.setHeading(movement2);
    let heading2 = c.getHeading();
    it('heading should be 45 (northeast)', function () {
        assert.equal(heading2,45);
    });

    c.setHeading(movement3);
    let heading3 = c.getHeading();
    it('heading should be 180 (south)', function () {
        assert.equal(heading3,180);
    });

});

describe('Geolocation getMovement',function testGetMovement(){
    geolocation.getMovement()
});
