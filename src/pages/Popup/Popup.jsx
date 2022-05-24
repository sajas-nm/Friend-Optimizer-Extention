import React from 'react';
// import logo from '../../assets/img/logo.svg';
import AppComponent from '../../containers/App/App';
import './Popup.css';
// import {
//   Router,
//   Link,
//   goBack,
//   goTo,
//   popToTop,
// } from 'react-chrome-extension-router';

const Popup = () => {
  // document.querySelector('#go-to-options').addEventListener(function () {
  //   console.log('sss');
  //   if (chrome.runtime.openOptionsPage) {
  //     chrome.runtime.openOptionsPage();
  //   } else {
  //     window.open(chrome.runtime.getURL('options.html'));
  //   }
  // });
  return (
    <div className="App">
      <AppComponent view={'popup'} />
    </div>
  );
};

export default Popup;
