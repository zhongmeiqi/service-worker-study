/**
 * @file sw.js
 */

console.log("hello service world");

self.addEventListener("fetch", function (event) {
  console.log(event);
});
