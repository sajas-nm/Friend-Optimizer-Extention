import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
// import './index.css';
import '../../styles/tailwind.css';

render(<Popup />, window.document.querySelector('#app-container'));
console.log('popup...');
// window.document.querySelector('#go-to-options').addEventListener('click');
// document.querySelector('#go-to-options').addEventListener('click', function () {
//   console.log('sKK...');
//   if (chrome.runtime.openOptionsPage) {
//     chrome.runtime.openOptionsPage();
//   } else {
//     window.open(chrome.runtime.getURL('options.html'));
//   }
// });
