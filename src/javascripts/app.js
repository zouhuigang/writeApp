import Character  from './Character/character';

var defaultChar = new Character('default-board');
var dataChar = new Character('data-board', {isXML: true});


// import {drawer as mdcDrawer} from 'material-components-web';
// console.log(mdcDrawer)
// const {MDCTemporaryDrawer, MDCTemporaryDrawerFoundation, util} = mdcDrawer;

// let drawer = new MDCTemporaryDrawer(document.querySelector('.mdc-temporary-drawer'));
// document.querySelector('.menu').addEventListener('click', () => drawer.open = true);