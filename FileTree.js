const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

// import { UIObject } from '/components/UIObject.js';
import { FSFolderComponent } from '/components/FSFolder.component.js';



export class FileTree { // extends UIObject {
  constructor(config, db) {
    this.parentElement = config.parentElement
    this.selector = config.selector;
    this.element;
    this.rootNode;
    this.activeNode = {
      node: null,
      children: {},
    };
    this.render()
    this.data
    this.folderTree$ = db.folderTree$;
    this.fileRefs$ = db.fileRefs$;

    this.clickSubject$ = new Subject()
    this.clickStream$ = fromEvent(this.element, 'click').subscribe(this.clickSubject$);
    // console.log('root', root)

    this.folderTree$
      .pipe(
        tap((x) => this.data = x),
        map(root => {
          console.log('root', root)
          root = this.createNode.bind(this)(root)
          return root
        }),

        tap(rootNode => this.append(rootNode.node)),
        tap(rootNode => this.rootNode = rootNode),
        tap(x => console.log('FileTree', x)),
        mergeMap(rootNode => {
          return this.clickSubject$
            .pipe(
              tap(this.handleClick.bind(this)),
            )
        }),
      )
      .subscribe();

    // this.append(this.root, this.parentElement)
  };

  append(node, parent, position, callback) {
    this.element.appendChild(node);
    return node;
  }

  createNode(node) {
    console.log(' createNode node', node)
    node = new FSFolder(node)
    const nodeEl = node.node
    console.log('nodeEl', nodeEl)
    // const nodeEl = document.querySelector(`#fs-${node.nodeType.toLowerCase()}-template`).content.firstElementChild.cloneNode(true);
    nodeEl.id = node.id;
    nodeEl.querySelector('.fs-node--name').textContent = node.name;
    // nodeEl.addEventListener('click', e => {
    //   nodeEl.classList.toggle('expanded')
    //   // nodeEl.querySelector('.folder-icon-svg').classList.tle('expanded')
    // })
    //   // n
    return node
  }

  getEventSourceNode(e) {
    if (e.path.some(el => {
        return el.classList.contains('fs-node--body')
      })) {
      return e.target.closest('li');
    }
  }

  handleClick(e) {
    const targ = this.getEventSourceNode(e)
    targ.classList.toggle('expanded')

    if (targ.classList.contains('expanded')) {
      Object.values(this.rootNode.children).forEach(ch => {
        // console.log('this.rootNode.children', this.rootNode.children)
        // console.log('chEl', ch)
        const chEl = this.createNode(ch);
        targ.querySelector('.node-list').appendChild(chEl.node)
      })
    } else {}
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.id = this.selector
    this.parentElement.appendChild(this.element)
    return this.element;
  }

  template() {
    return `<ul id="file-tree">POOP</ul>`
  }
  get name() { return this._name };
  set name(newValue) {
    this._name = newValue
  };
}
