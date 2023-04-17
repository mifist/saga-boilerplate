import React from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';

const setStatusBarStyleDark = () => {
  StatusBar.setStyle({ style: Style.Dark });
};

const setStatusBarStyleLight = () => {
  StatusBar.setStyle({ style: Style.Light });
};

const setStatusBarBackgroundColor = color => {
  const mainColor = "#005D9F";
  const defaultColor = color ? color : mainColor;
  StatusBar.setBackgroundColor({ color: defaultColor });
};

const hideStatusBar = () => {
  StatusBar.hide();
};

const showStatusBar = () => {
  StatusBar.show();
};

const setupStatusBarListener = () => {
  // iOS only
  window.addEventListener('statusTap', function () {
    console.log('statusbar tapped');
  }); 

  // Display content under transparent status bar (Android only)
  // Set whether or not the status bar should overlay the webview to allow usage of the space underneath it.
  StatusBar.setOverlaysWebView({ overlay: false });
};


export default {
  setStatusBarStyleDark,
  setStatusBarStyleLight,
  setStatusBarBackgroundColor,
  hideStatusBar,
  showStatusBar,
  setupStatusBarListener,
}
