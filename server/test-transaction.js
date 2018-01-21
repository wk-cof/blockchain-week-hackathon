const ethTx = require('ethereumjs-tx');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/J4t6abLGB8wPQqPNT8OY"));

let contractAddress = '0x18c3c10A0d661B0096e8460b60F4c7D4711172dc';
let myAddress = '0x135C54A57df0B41e9082e450deFe102eF59b93D6';
let pk = '185f8d8957136a4261a85f50a8657f312b33640f6c847f07f6afbdfe2a471d94';

const txParams = {
  nonce: '0x5', // Replace by nonce for your account on geth node
  gasPrice: '0x09184e72a000',
  gasLimit: '0x30000',
  to: contractAddress,
  value: '0x0111'
};

// Transaction is created
const tx = new ethTx(txParams);
const privKey = Buffer.from(pk, 'hex');
// Transaction is signed
tx.sign(privKey);
const serializedTx = tx.serialize();
const rawTx = '0x' + serializedTx.toString('hex');
console.log(rawTx);

web3.eth.sendRawTransaction(rawTx, function(err, hash) {
    if (!err) {
        console.log(hash);
    }
    else {
        console.log(err);
    }
  });
