let duris = '1a2a3a4a5a6a7a8a9a10a11a12a13a';
let qate = '1a2a3a4a5a6e7a8a9v10a11s12a13s';
let juwap = '1a2a3a4a5a6a7a';
let text = '1a2a3a4a5a6a7a';
String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

let i = 1

console.log(juwap.search('asd'))
