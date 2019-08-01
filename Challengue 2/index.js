/**
 *  The problem is to find the Valleys and the Peaks from an array of numbers, 
 *  defined as valley a number between 2 greater numbers and a Peak between 2 numbers lower that it.
 * 
 *  the start point from the array and the endpoint only cares about the only neighbour they have.
 * 
 */
var test1 = [5, 10, 20, 15];
var test2 = [10, 20, 15, 2, 23, 90, 67];

//! Change the variable testx to wichever test you like or add your new test case and replace the variable. 
var array = test2;

var valleys = [];
var peaks = [];

for (let i = 0; i < array.length; i++) {
     if (i == 0) { //? Check the first number 
          if (array[i] > array[i + 1]) {//! It is a Peak
               peaks.push(array[i]);
          } else if (array[i] < array[i + 1]) {//! It is a Valley
               valleys.push(array[i]);
          }// * No condition for flat
     } else if (i == array.length - 1) {//? Check the last number
          if (array[i] > array[i - 1]) {//! It is a Peak
               peaks.push(array[i]);
          } else if (array[i] < array[i - 1]) {//! It is a Valley
               valleys.push(array[i]);
          }//* No condition for flat
     } else {// ? All the numbers in between the first and the last
          if ((array[i] > array[i + 1]) && (array[i] > array[i - 1])) {//! It is a Peak if x<i>y
               peaks.push(array[i]);
          } else if ((array[i] < array[i + 1]) && (array[i] < array[i - 1])) {//! It is a Valley if x>i<y
               valleys.push(array[i]);
          }//* No condition for flat
     }
}

console.log(`Valleys: (${valleys.length}) - ${valleys}`);
console.log(`Peaks: (${peaks.length}) - ${peaks}`);



