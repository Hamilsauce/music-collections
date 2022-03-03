const { ReplaySubject, AsyncSubject, timer, iif, Subject, interval, of , merge, from } = rxjs;
const { groupBy, toArray, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, reduce } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const fileStreamSubject$ = new ReplaySubject();

const SOURCE = {
  muex: './data/reference-trees/music-exchange1.json'
}

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
let ctr = 0
const createNodeReferences = (parent, children) => {
++ctr
if (ctr === 51) {
console.log('parent, children) => {', parent, children)
  
}
  if (children) {
    children.forEach((ch, i) => {
      ch.parentId = parent.id
      ch.parentName = parent.name;
      if (ch.nodeType === 'File') delete ch.children
    });

    if (parent) {
      // console.log('if (parent) {',parent)
      parent.childrenRefs = children.reduce((refs, ch) => [...refs, ch.id], []);
      parent.size = parent.childrenRefs.length
    }
  }
};

const flattenTree = (obj, curr) => {
  let currentFolder;
  let array;
  if (!Array.isArray(obj)) {
    currentFolder = obj;
    currentFolder.isRoot = false;
    currentFolder.subRoot = true;
    createNodeReferences(obj, obj.children)
    array = [obj];
  } else {
    currentFolder = curr;
    array = obj
    createNodeReferences(currentFolder, obj)
  }

  return array.reduce((acc, value) => {
    let { children, ...node } = value
    acc.push(node);
    if (node.nodeType === 'Folder') {
      currentFolder = node;
      acc = children ? acc.concat(flattenTree(children, currentFolder)) : acc;
    }
    return acc;
  }, []);
  return
}

export default fromFetch(SOURCE.muex)
  .pipe(
    mergeMap(res => from(res.json())
      .pipe(map(flattenTree))
    ),
    tap(x => console.log('after flatten musicexhange.json', x)),
    mergeMap(nodeArray => from(nodeArray)),
  );
