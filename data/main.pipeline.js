import muExConnector$ from './connectors/music-exchange.connector.js'

const { concat, ReplaySubject, AsyncSubject, timer, iif, Subject, interval, of , merge, from } = rxjs;
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


const PIPELINE$ = muExConnector$
  .pipe(
    groupBy(node => node.nodeType),
    map(nodeGroup$ => nodeGroup$),
  )


export const files$ = PIPELINE$
  .pipe(
    filter(({ key }) => key === 'File'),
  )

export const folders$ = PIPELINE$
  .pipe(
    filter(({ key }) => key === 'Folder'),
  )


export default {
  streams: {
    files$,
    folders$
  }
}
