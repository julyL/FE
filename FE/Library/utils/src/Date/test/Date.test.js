import format from '../format.js';
import getDays from '../getDays.js';
import chai from 'chai';
let expect = chai.expect;

describe('Date', function() {

    it('format格式化', function() {
      expect(format(new Date("2016-08-22 04:50:40"),"yyyy年mm月dd日 HH:MM:SS")).to.be.equal("2016年08月22日 04:50:40");
    });

    it('getDays获取天数', function() {
      expect(getDays(2004,2)).to.be.equal(29);
    });

  });