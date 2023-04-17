import React, { useEffect } from 'react';
import { Keyboard } from '@capacitor/keyboard';

function KeyboardListener() {

  useEffect(() => { 

    Keyboard.setAccessoryBarVisible({ visible: true });

    Keyboard.addListener('keyboardDidShow', info => {
      document.body.classList.add('keyboard-did-show');
    });
  
    Keyboard.addListener('keyboardDidHide', info => {
      document.body.classList.remove('keyboard-did-show');
    });
  
    Keyboard.addListener('keyboardWillShow', info => {
      const screenSize = document.body.offsetHeight - info.keyboardHeight;
  
      // resize body to total size less keyboard (allow scroll)
      document.body.style.height = `${screenSize}px`;
      console.debug('screenSize:', screenSize);
      // console.debug(document.body.style.height);
      // console.debug(document.activeElement.getBoundingClientRect().bottom);
      if (
        document?.activeElement &&
        document.activeElement.getBoundingClientRect().bottom > screenSize
      ) {
        // console.debug('reducing sizeee and scrolling');
        document.activeElement.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }
    });
    
    Keyboard.addListener('keyboardWillHide', info => {
      document.getElementById('chat-container-id').style.height = `100%`;
    });

  }, []);

  return <></>;

};

export default KeyboardListener;