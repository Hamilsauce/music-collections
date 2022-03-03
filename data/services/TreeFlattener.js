import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

let flattened = []


const traverse = node =>
  (node.children.length ? [] : [[node.item]])
  .concat(
    ...node.children
    .map(child => traverse(child)
      .map(arr => [node.item].concat(arr))
    )
  );


const flatten = (tree) => {
  tree.children.forEach((child, i, arr) => {

    child.forEach((subChild, i) => {


    });

  });


};

export default (tree, { name, id }) => flatten()
