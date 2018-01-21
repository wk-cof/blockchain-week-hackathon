//import * as blah from './tx-builder';
let blah = require('./tx-builder');

let contractAddress = '0x18c3c10A0d661B0096e8460b60F4c7D4711172dc';
let myAddress = '0x135C54A57df0B41e9082e450deFe102eF59b93D6';
let pk = '185f8d8957136a4261a85f50a8657f312b33640f6c847f07f6afbdfe2a471d94';

let trans = blah.buildTx(contractAddress, pk, 1, 'addUser(uint)', 22);

