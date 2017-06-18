$(document).ready(function () {
    // dom loaded
});

var getdata1 = function(){
    return ['hello', 'bye'];
}

var getdata2 = function(){
    var arr = [];
    for(var i=0; i<10; i++){
        arr.push(i);
    }
    return arr;
}

// vue.js
var app = new Vue({
    el: '#app',
    data: {
        collection: getdata1(),
        otherstuff: getdata2()
    }
});