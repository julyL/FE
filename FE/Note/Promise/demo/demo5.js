var p1 = Promise.resolve( 1 );
var p2 = Promise.resolve( p1 );
// p1 === p2