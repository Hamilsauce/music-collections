const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { toArray, groupBy, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, reduce, mapTo } = rxjs.operators;


/*
  SOURCE OBSERVABLES
*/

/*
  LOOKUP TABLE OBSERVABLE
*/

// const idNameLookup$ = homeDbFolders$.pipe(tap(x => console.log('idNameLookup$', x)))


/*
  TRACES FOLDER REFS TO FILE REF, 
  ADDS ID TO FILE
*/
// => 
// (foldersRef$, filesRef$, fileData$) 

export default (folderRefs$, fileRefs$, fileData$) => folderRefs$
  .pipe(
    map(folderRefsArray => Object.values(folderRefsArray)),
    mergeMap(folderRefsArray => fileRefs$.pipe(
      mergeMap(fileRefs => fileData$.pipe(
        mergeMap(files => from(files).pipe(
          filter(_ => _.folderPath.includes('003 Music Exchange (Shared Projects)')),
          map((file, i) => {
            const newpath = file.folderPath.split('/').filter(_ => _)
            const depth = newpath.length
            let fileId
            const idPath = newpath
              .reduce((idArray, pathSeg, j, arr) => {
                const folder = folderRefsArray.find(_ => _.name === pathSeg)

                if (j >= depth - 1) {
                  fileId = (folder.childrenRefs.files || [])
                    .reduce((matchedName, curr, k) => {
                      const temp = fileRefs[curr]
                      return temp && temp.name === file.name ? temp.id : matchedName
                    }, null)
                }

                return [...idArray, folder.id || null]
              }, []);
            return { ...file, depth, idPath, id: fileId }
          })
        ))
      ))
    )),
    toArray(),
    // tap(x => console.log('PATHS', x)),
  )

// export default (foldersRef$, filesRef$, fileData$) => fileIdFinder(foldersRef$, filesRef$, fileData$);


scan((collectionMap, arr) => {
  return arr
    .reduce((childMap, folder, i) => {
      console.log('folder, childMap', folder, [...childMap])

    }, new Map([arr, new Map()]))


  console.log('arr.map(_ => [_.id, _]))', arr.map(_ => [_.id, _]))
  return map.set(arr[0], new Map(arr.map(_ => [_.id, _])))
}, new Map())