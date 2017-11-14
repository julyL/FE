var p = new Promise(function (resolve, reject) {
    resolve(1);
    console.log(1)
});

console.log(2);

p.then(function () {
    console.log(3);
});
