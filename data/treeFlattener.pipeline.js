const { ReplaySubject, AsyncSubject, timer, iif, Subject, interval, of , merge, from } = rxjs;
const { groupBy, toArray, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, reduce } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const fileStreamSubject$ = new ReplaySubject();

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

let ctr = 0
const createNodeReferences = (parent, children) => {
  ctr = ctr + 1
  if ([undefined, null, 0].includes(parent || children)) {
    console.log('top of createNodeReferences', ctr)
    console.log('parent, children', parent, children)
  }

  if (children) {
    children.forEach((ch, i) => {
      ch.parentId = parent.id
      delete ch.parentName
      if (ch.nodeType === 'File') delete ch.children
    });
    if (parent) {
      parent.childrenRefs = children.reduce((refs, ch) => [...refs, ch.id], []);
      parent.size = parent.childrenRefs.length
    }
  }
};

let currentFolder;
export const flattenTree = (obj, curr) => {
  console.log('OBJRCT IS FALY', obj, curr);
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
    let { children, parentName, ...node } = value
    acc.push(node);
    if (node.nodeType === 'Folder') {
      currentFolder = node;
      acc = children ? acc.concat(flattenTree(children, currentFolder)) : acc;
    }
    return acc;
  }, []);
  return
}


// export default ({ url, jsonKey }) => fromFetch('./data/mufolder.json')
  // .pipe(
  //   mergeMap(res => res.json()),
  //   tap(x => console.log('HTTPPARSER', x.files)),
  //   map(x => x.files),
  //   mergeMap((f) => Array.isArray(f) ? from(f) : from(f['files'])),
  //   map(flattenTree),

  //   tap(x => console.log('AFTER FLATTENTREE', x)),
  // ).subscribe()
  
  
  

// const muexData$ = fromFetch('./data/muex.json')
// export default (treeData$) => treeData$.pipe(map(flattenTree))

// const flattenedFileTree$ = fromFetch('./data/mufolder.json')
//   .pipe(
//     mergeMap(res => res.json()),
//     mergeMap((f) => Array.isArray(f) ? from(f) : from([f.files])),
//     map(flattenTree),
//     // tap(x => console.log('FLATTENTREE', x)),
//     // tap(_=>download('muex-flat.json', JSON.stringify(_,null,4))),
//   )
//   ///.subscribe(fileStreamSubject$)



// export default fileStreamSubject$
// export default fileStreamSubject$
