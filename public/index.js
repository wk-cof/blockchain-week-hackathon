// sock.js setup

'use strict';
console.log('started script');
const sockjs = new SockJS('/echo');
sockjs.onopen = () => {
  console.log('connected to server.');
  sockjs.send('Hello! I am a new client testing out messaging.');
};
sockjs.onclose = () => {
  console.log('disconnected.');
};

// NOTE: websockets do not guarantee that info arrives in same order it was sent
// nor does server send info in series in order
sockjs.onmessage = (res) => {
  console.log(res.data);
};

window.onload = () => {
  // dom loaded
};

const getdata1 = function () {
  return ['hello', 'bye'];
};

const getdata2 = function () {
  const arr = [];
  for (let i = 0; i < 10; i += 1) {
    arr.push(i);
  }
  return arr;
};

// vue.js
window.app = new Vue({
  el: '#app',
  data: {
    collection: getdata1(),
    otherstuff: getdata2(),
  },
  filter: {

  },
  computed: {

  },
  watch: {

  },
  methods: {

  },
});