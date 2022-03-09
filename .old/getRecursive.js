const { forkJoin, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, flatMap, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const data = {
  1: {
    id: 1,
    name: "Kasthuri",
    children: [2]
  },
  2: {
    id: 2,
    name: "Ratnakumar",
    children: [3, 4]
  },
  3: {
    id: 3,
    name: "Mohan Ram",
    children: [6]
  },
  4: {
    id: 4,
    name: "Janani",
    children: [5]
  },
  5: {
    id: 5,
    name: "Rithick",
    children: []
  },
  6: {
    id: 6,
    name: "Danvir",
    children: []
  }
};
const getFromServer = (id) => { return of(data[id]); };
const getRecursive = (id) => {
  return getFromServer(id)
    .pipe(
      map(data => ({
        parent: {
          name: data.name,
          id: data.id,
          children: []
        },
        childIds: data.children
      })),
      flatMap(parentWithChildIds =>
        forkJoin([
          of (parentWithChildIds.parent),
          ...parentWithChildIds.childIds
          .map(childId => getRecursive(childId))
        ])
      ),
      tap(
        ([parent, ...children]) => (parent.children = children)
      ),
      map(([parent]) => parent) //as TreeData
    );
};

const [selector] = document.getElementsByTagName("pre");

getRecursive(1).subscribe(
  d => (selector.innerHTML = JSON.stringify(d, null, 4))
);
