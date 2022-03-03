const { forkJoin, iif, ReplaySubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
import { DataSource } from '/data/modules/DataSource.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { download, date, array, utils, text } = ham;
const dbUrl = '/data/_homedb-local/homedb-local.json';


const homeDbSource = new DataSource();

const dbConnection$ = homeDbSource.connect(dbUrl, 'json')
  .pipe(
    map(Object.entries),
    switchMap(_ => from(_))
  );

const groupByCollection$ = dbConnection$
  .pipe(
    filter(_ => _.key !== 'rootId'),
    groupBy(([k, v]) => k)
  );

const folderRefCollection$ = groupByCollection$
  .pipe(filter(_ => _.key === 'folderRefs'));

// const groupByParentIdPipe$ = groupByCollection$
const groupByParentIdPipe = (collections$, collectionName) =>
  collections$.pipe(
    mergeMap((group$) => group$
      .pipe(
        filter(([k, v]) => k === collectionName),
        map(([k, v]) => Object.values(v)),
        mergeMap(_ => from(_)
          .pipe(groupBy(({ parentId }) => parentId))
        )
      )
    )
  );

const getFolder = (id) => folderRefCollection$
  .pipe(
    mergeMap(refs$ => refs$
      .pipe(
        map(([key, refs]) => refs[id])
      )
    )
  );

let depth = 0;

const getRecursive = (folder$, depth = 0) => {

  return folder$
    .pipe(
      map(folder => {
        const { childrenRefs } = folder;
        childrenRefs.files = childrenRefs.files ? childrenRefs.files : [];
        delete folder.childrenRefs;
        return { folder, childrenRefs };
      }),
      map(({ folder, childrenRefs }) => ({
        parent: { ...folder, depth, fileRefs: childrenRefs.files || [] },
        childIds: childrenRefs.folders || []
      })),
      flatMap(parentWithChildIds =>
        forkJoin([
          of(parentWithChildIds.parent),
          ...parentWithChildIds.childIds
            .map((childId) => getRecursive(getFolder(childId)))
        ])
      ),
      tap(parent => {
        parent.depth = ++depth;
      }),
      tap(
        ([parent, ...children]) => (parent.children = children
          .reduce((collection, child, i) => {
            return { ...collection, [child.id]: child };
          }, {}))
      ),
      map(([parent]) => parent), //as TreeData
    );
};

const rootId$ = dbConnection$
  .pipe(
    filter(([k, v]) => k === 'rootId'),
    map(([k, v]) => v)
  );

const rootFolder$ = rootId$.pipe(
  mergeMap(id => getFolder(id)
    .pipe(tap(x => console.log('rootFolder$', x)))
  )
);






const buildTreePipe = (groupedStream$) => {
  return groupedStream$
    .pipe(
      mergeMap(group$ => group$
        .pipe(
          toArray(),
          scan((folderMap, group, i) => {
            const pid = group[0].parentId;
            const parentFolderObj = folderMap[pid] ? folderMap[pid] : {};
            folderMap = {
              ...folderMap,
              [group[0].parentId]: {
                children: group.reduce((childMap, folder, j) => ({ ...childMap, [folder.id]: { ...folder } }), {}),
                values() { return Object.values(this.children); },
                entries() { return Object.entries(this.children); },
              }
            };
            return folderMap;
          }, {}),
        )
      ),
      reduce((collectionMap, group, i) => ({ ...collectionMap, ...group }), {}),
      tap(x => console.log('BUILD TREE END ', x)),
    );
};

const addFileDataPipe = (treeStream$) => {
  return treeStream$
    .pipe(
      map(collectionMap => {
        const folderChildren = Object.values(collectionMap)
          .reduce((flat, child) => [...flat, ...child.values()], []);

        folderChildren.forEach((curr) => {
          if (collectionMap[curr.id]) {
            collectionMap[curr.id] = { ...collectionMap[curr.id], ...curr };
          }
        });
        return collectionMap;
      }),
      // tap(x => console.log('x2', x)),
    );
};

const mapCollections$ = groupByCollection$
  .pipe(
    mergeMap((group$) => group$
      .pipe(
        map(([key, data]) => ({
          key,
          data: key === 'rootId' ? data : [...Object.entries(data)].reduce((entries, entry, i) => {
            if (!Array.isArray(entry)) entry = [entry.id, entry];

            return entries.set(entry[0], entry[1]);
          }, new Map())
        }),
          tap(x => console.log(' BEFORE END mapCollections$ 2', x)),
        )
      )
    )
  );

const download$ = (data$, filename) => {
  return data$.pipe(
    tap(x => {
      const json = JSON.stringify(x, null, 2);
      download(filename, json);
      return console.log('x', x);
    }));
};

const foldersByParentId$ = groupByParentIdPipe(groupByCollection$, 'folderRefs');

const pIds$ = groupByCollection$
  .pipe(
    mergeMap((group$) => group$
      .pipe(
        filter(([k, v]) => k === 'folderRefs'),
        map(([k, v]) => v),
        map(Object.values),
        map(_ => _.map(_ => _.parentId)),
        tap(x => console.log('pIds$', x)),
        map(arr => {
          console.log('arr B4 SET', arr);
          const ids2 = new Set(arr);
          console.log('ids2', [...ids2]);
          return ids2;
        }),
      )
    ));

const homeDb_fileRefs$ = mapCollections$.pipe(
  filter(_ => _.key === 'fileRefs'),
  tap(x => console.log('FILEREFS END MAP GROUPING', x)),
); //.subscribe()

const homeDb_fileData$ = mapCollections$.pipe(
  filter(_ => _.key === 'FILEDATA END'),
);

const homeDb_folderRefs$ = mapCollections$.pipe(
  filter(_ => _.key === 'FOLDERREFS END'),
);



const collectionSubject$ = new Subject();
const folderTreeSubject$ = new Subject();

const parentFolders$ = addFileDataPipe(buildTreePipe(foldersByParentId$));
mapCollections$.subscribe(collectionSubject$);
const folderTreeSubscription = getRecursive(rootFolder$, 0).subscribe(folderTreeSubject$);

export default {
  collectionSubject$,
  parentFolders$,
  download$,
  folderTree$: folderTreeSubject$
};
// mapCollections$
