// import CSSS from 'https://hamilsauce.github.io/hamhelper/css-selector.js'
// consdate, array, utils, text } = ham;
// const { qs, qsa 
// console.log('CSSS', CSSS)
// CSSS('coll.html')
// const games = [...document.querySelectorAll('.game')]
// const gameColls = [...document.querySelectorAll('.game-collapsible')]
const expandNode = (rootNodeList, childScrollHeight) => {
  rootNodeList.style.zIndex = 30;
  if (childScrollHeight) {
    rootNodeList.style.maxHeight = `${parseInt(rootNodeList.style.maxHeight) + parseInt(childScrollHeight)}px`;
  } else {
    rootNodeList.style.maxHeight = rootNodeList.scrollHeight + "px";
  }
}

const $ = (selector = '*', el = document) => el.querySelector(selector)
const $$ = (selector = '*', el = document) => el.querySelectorAll(selector)



const app = document.querySelector('.app')
const appBody = document.querySelector('.app-body')
const fileTree = document.querySelector('#file-tree')
const rootNode = fileTree.querySelector("[fs-root]")
const rootNodeList = rootNode.querySelector(".node-body")
const collapsibles = [...fileTree.querySelectorAll('.collapsible')]
const collapsiblesBodies = [...document.querySelectorAll('.collapsible-body')]
// const childCollapsibles = [...document.querSelectorAll('.collapsible')]
const collapsibleHeaders = [...document.querySelectorAll('.collapsible-header')]
console.log('rootNode', rootNode)
/*

Add event listenrr on file tree
*/

$$('.node-body') .forEach((n, i) => {
n.style.maxHeight = null
  
});
rootNodeList.maxHeight = 0;
rootNode.addEventListener('node-click', e => {
  const targ = e.target
  const {childMaxHeight} = e.detail;
  // const rootHeight = rootNode.childMaxHeight
  // const content = document.querySelector('.app-body')
console.log('childMaxHeight', childMaxHeight)
  // console.log('file tree targ', targ)
  // console.log('file tree content', content)
  expandNode(rootNodeList, childMaxHeight)
  // content.style.maxHeight = `${parseInt(content.scrollHeight) + parseInt(childHeight)}px`;
});

// const collapsibleHeaders = $$('.series-collapsible')


collapsibles.forEach((node, i) => {
  /* 
  *  Series' handle CHILD clicks
  */
  node.addEventListener("node-clicked", e => {
    const targ = e.target
    const childHeight = e.detail.childMaxHeight
    const content = document.querySelector('.app-body', )

    console.log('targ', targ)
    console.log('content', content)
    // const content = document.querySelector('.content-wrapper')
    content.style.maxHeight = `${parseInt(content.scrollHeight) + parseInt(childHeight)}px`;
  });
});

collapsibleHeaders.forEach((s, i) => {
  /* 
  *  Only handles SERIES COLLAPSIBLE clicked
  */
  s.addEventListener("click", e => {
    const collBody = e.currentTarget.nextElementSibling;

    e.target.classList.toggle("active");

    if (collBody.style.maxHeight) {
      const childcollBodies = [...collBody.querySelectorAll('.collapsible-body')];
      const childColls = [...e.target.querySelectorAll('.fs-node')];
      collBody.style.maxHeight = null;
      childcollBodies.forEach(ch => ch.style.maxHeight = null);
      childColls.forEach(ch => ch.classList.remove("active"));
    } else collBody.style.maxHeight = `${collBody.scrollHeight}px`;
  });
})

$$('.collapsible', rootNodeList).forEach((coll, i) => {
  /* 
  *  Only handles coll COLLAPSIBLE clicked
  */
  coll.addEventListener("click", e => {
    const header = $('.collapsible-header', coll)
    const nodeList = $('.collapsible-body', coll)
    console.log('header', header)
    // const nodeList = targ.nextElementSibling;
  console.log('nodeList', nodeList)
    nodeList.classList.toggle("active");
    if (nodeList.style.maxHeight) {
      nodeList.style.maxHeight = null;
    } else {
      nodeList.style.maxHeight = nodeList.scrollHeight + "px";
    }

    const nodeClickEvent = new CustomEvent('node-click', { bubbles: true, detail: { childMaxHeight: nodeList.style.maxHeight } })
    coll.dispatchEvent(nodeClickEvent)
  });
});
