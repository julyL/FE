const cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var fs = require("fs");
var app = express();

var result = [];

(function getData(page) {
  page = page || 1;
  console.log("get: ", page);
  var postdata = {
    status: 2,
    sort: "zhtj",
    categoryId: 10,
    parentCategoryId: "",
    sceneEnd: "",
    productEnd: "",
    keyword: "",
    page: 1
  };
  postdata.page = page;
  return new Promise(function(resolve, reject) {
    request.post(
      {
        url: "https://z.jd.com/bigger/search.html",
        form: postdata
      },
      function(err, httpResponse, body) {
        const $ = cheerio.load(body);
        var $list = $(".info");
        var nowdate = new Date();
        var allpage = parseInt($(".l-statistics strong").text() / 16);
        $list.each(function(index, val) {
          result.push({
            date: +nowdate,
            index: "page:" + postdata.page + " , index:" + index,
            title: $(val)
              .find(".i-tits .link-tit")
              .text(),
            image: $(val)
              .find(".link-pic img")
              .attr("src"),
            href: $(val)
              .find(".link-pic")
              .attr("href"),
            precent: $(val)
              .find(".fore1 .p-percent")
              .text(),
            sum: $(val)
              .find(".fore2 .p-percent")
              .text(),
            day: $(val)
              .find(".fore3 .p-percent")
              .text(),
            likenum: $(val)
              .find(".support span")
              .text()
              .trim()
          });
        });
        resolve();
        console.log("load", page);
        if (page == 1) {
          var ajaxData = [];
          for (var i = 2; i <= allpage; i++) {
            ajaxData[i - 2] = getData(i);
          }
          console.log(ajaxData);
          Promise.all(ajaxData).then(function() {
            fs.writeFile("data.json", JSON.stringify(result), function(e) {
              if (e) {
                console.log("error", e);
              } else {
                console.log("success");
              }
            });
          });
        }
      }
    );
  });
})();
app.listen(3000);
