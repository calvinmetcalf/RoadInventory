[].indexOf || (Array.prototype.indexOf = function(a, b, c) {
  c = this.length;
  b = (c + ~~b) % c;
  while (b < c && ((!(b in this)) || this[b] !== a)) {
    b++;
  }
  if (b ^ c) {
    return b;
  } else {
    return -1;
  }
});