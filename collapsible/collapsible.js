import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

class Node {
  constructor({ root, button, content, isRoot = false }) {
    this._active = false;
    this.isRoot = isRoot || false
    this.self = root;
    this.parent;
    this.button = button;
    this.content = content;
    this.children = [...this.content.children].filter(_ => _.classList.contains('node'))
    this.nodes = new Map(this.children.map(_ => [_, this.createChildNode.bind(this)(_)]))
    this.button.addEventListener('click', this.handleButtonClick.bind(this));
  };

  createChildNode(el) {
    return new Node({
      root: el,
      button: el.querySelector('.collapsible-button'),
      content: el.querySelector('.collapsible-content'),
      parent: this,
    });
  }

  toggleActiveState(state) {
    this.self.dataset.active = state
  }

  buttonClicked(e) {
    return e.target === this.button || e.target.closest('.collapsible-button') === this.button
  }

  getTargetNode(e) {
    let t = e.target.classList.contains('node') ?
      e.target : e.target.closest('.node')

    if (this.nodes.has(t)) {
      return this.nodes.get(t)
    }
    return null;
  }

  handleButtonClick(e) {
    if (!this.buttonClicked(e)) return;
    this.active = !this.active

    if (this.content.style.maxHeight) {
      this.content.style.maxHeight = null;
    } else {
      this.content.style.maxHeight = this.content.scrollHeight + "px";
    }

    const childClickEvent = new CustomEvent('child-clicked', { bubbles: true, detail: { childMaxHeight: this.content.style.maxHeight } })
    this.self.dispatchEvent(childClickEvent)
  }

  get active() { return this._active };
  set active(newValue) {
    this._active = newValue
    this.toggleActiveState(this.active);

    if (!this.active) {
      this.nodes.forEach((ch) => {
        ch.active = false;
        ch.content.style.maxHeight = null
      });
    }
  }
}


class RootNode extends Node {
  constructor(config) {
    super({ ...config, isRoot: true, parent: null })
    this.content.addEventListener('child-clicked', this.handleChildButtonClick.bind(this));
    this.self.addEventListener('click', this.handleButtonClick.bind(this));
    this.parent = null;
  }

  handleButtonClick(e) {
    if (!this.buttonClicked(e)) return;

    this.active = !this.active

    if (this.content.style.maxHeight) {
      this.content.style.maxHeight = null;
    } else this.content.style.maxHeight = `${this.content.scrollHeight}px`;

    e.preventDefault();
    e.stopPropagation()
  }

  handleChildButtonClick(e) {
    const childHeight = e.detail.childMaxHeight
    this.content.style.maxHeight = `${parseInt(this.content.scrollHeight) + parseInt(childHeight)}px`;
  }
}



const rootNode = new RootNode({
  root: document.querySelector('#root'),
  content: root.querySelector('#root-content'),
  button: root.querySelector('#root-collapsible'),
})


/* 
 *  root handle CHILD clicked 
 */
// root.addEventListener("child-clicked", e => {
//   const targ = e.target
//   const childHeight = e.detail.childMaxHeight
//   const content = s.querySelector('.root-content')
//   content.style.maxHeight = `${parseInt(content.scrollHeight) + parseInt(childHeight)}px`;
// });

/* 
 *  Only handles ROOT COLLAPSIBLE clicked
 */
// rootCollapsibleButton.addEventListener("click", e => {
//   const content = e.target.nextElementSibling.firstElementChild

//   e.target.classList.toggle("active");

//   if (content.style.maxHeight) {
//     const childContents = [...ham.DOM.qsa('.content', content)];
//     const childCollapsibleButtons = [...ham.DOM.qsa('.collapsible', content)];
//     content.style.maxHeight = null;

//     childContents.forEach(ch => ch.style.maxHeight = null);
//     childCollapsibleButtons.forEach(ch => ch.classList.remove("active"));
//   } else content.style.maxHeight = `${content.scrollHeight}px`;
// })




// childCollapsibleButtons.forEach((child, i) => {
//   /* 
//   *  Only handles CHILD COLLAPSIBLE clicked
//   */
//   child.addEventListener("click", e => {
//     const targ = e.target
//     const content = e.target.nextElementSibling;
//     targ.classList.toggle("active");
//     if (content.style.maxHeight) {
//       content.style.maxHeight = null;
//     } else {
//       content.style.maxHeight = content.scrollHeight + "px";
//     }

//     const childClickEvent = new CustomEvent('child-clicked', { bubbles: true, detail: { childMaxHeight: content.style.maxHeight } })
//     targ.dispatchEvent(childClickEvent)
//   });
// });