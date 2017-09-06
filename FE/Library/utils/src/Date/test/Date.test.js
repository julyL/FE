import formatDate from '../formatDate.js';
import getDays from '../getDays.js';
import chai from 'chai';
let expect = chai.expect;

describe('Date', function() {

    it('formatDate格式化', function() {
      expect(formatDate(new Date("2016-08-22 04:50:40"),"yyyy年mm月dd日 HH:MM:SS")).to.be.equal("2016年08月22日 04:50:40");
    });

    describe('getDays', function() {
      it('getDays(2004) => 366', function() {
        expect(getDays(2004)).to.be.equal(366);
      });

      it('getDays(2004,2) => 29', function() {
        expect(getDays(2004,2)).to.be.equal(29);
      });

      it('getDays(new Date("2004/02")) => 29', function() {
        expect(getDays(new Date("2004/02"))).to.be.equal(29);
      }); 
    });




  });