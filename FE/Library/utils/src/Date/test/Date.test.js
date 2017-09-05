import parseDate from '../parseDate.js';
import getDays from '../getDays.js';
import chai from 'chai';
let expect = chai.expect;

describe('Date', function() {

    it('parseDate格式化', function() {
      expect(parseDate(new Date("2016-08-22 04:50:40"),"yyyy年mm月dd日 HH:MM:SS")).to.be.equal("2016年08月22日 04:50:40");
    });

    it('getDays(2004,2) => 29', function() {
      expect(getDays(2004,2)).to.be.equal(29);
    });

    it('getDays(2004) => 366', function() {
      expect(getDays(2004)).to.be.equal(366);
    });

  });