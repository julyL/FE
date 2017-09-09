import chai from 'chai';
let expect = chai.expect;

import {
  countdown, 
  formatDate,
  getDays,		 
  getDaysBetween,	 
  parseDate,        
  isLeapYear,
  parseDate 
} from '../src/Date/index.js'


describe('Date', function() {

    describe('formatDate', function() {
      it('formatDate(new Date("2016-08-22 04:50:40"),"yyyy年mm月dd日 HH:MM:SS") => 2016年08月22日 04:50:40', function() {
        expect(formatDate(new Date("2016-08-22 04:50:40"),"yyyy年mm月dd日 HH:MM:SS")).to.be.equal("2016年08月22日 04:50:40");
      });

      it('formatDate(new Date("2016-08-22 04:05:40"),"H时M分S秒") => 4时5分40秒', function() {
        expect(formatDate(new Date("2016-08-22 04:05:40"),"H时M分S秒")).to.be.equal("4时5分40秒");
      });

     })

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

    describe('isLeapYear', function() {
      it('isLeapYear(2004) => true', function() {
        expect(isLeapYear(2004)).to.be.equal(true);
      });
    });

});