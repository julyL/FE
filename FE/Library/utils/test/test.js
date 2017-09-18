test(
  'formatDate(new Date("2016-08-22 04:50:40"),"YYYY年MM月DD日 hh:mm:ss")',
  "2016年08月22日 04:50:40"
);

test('formatDate(new Date("2016-08-22 04:05:40"),"h时m分s秒")', "4时5分40秒");

test("getDays(2004)", 366);

test("getDays(2004,2)", 29);

test('getDays(new Date("2004/02"))', 29);

test("isLeapYear(2004)", true);

test("countdown(3666006)");

test(
  'countdown(new Date("2017/9/10 11:11:11"),new Date("2017/9/12 12:12:12"))'
);

test("Url('https://www.baidu.com/?a=a%3D2&b=33#hash').parse()");

test("Url('https://www.baidu.com/?a=a%3D2&b=33#hash').get('a')");

test("Url('https://www.baidu.com/?a=a%3D2&b=33#hash').set('b',44)");

var testData = {
  a: [
    {
      c: {
        b: [233]
      }
    }
  ]
};
test("getValuebypath(testData,'a[0].c.b[0]')");

test("getValuebypath(testData,['a','0','c','b','0'])");
