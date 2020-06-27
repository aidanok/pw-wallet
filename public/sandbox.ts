/**
 * This code is compleplely isolated fom the outside world.
 * It should run in a hidden iframe that only accepts messages
 * from its parent via postMessage, and its parent is _untrusted_
 * 
*/

import Arweave from 'arweave/web';


/**
 * Gets the parent origin. 
 * 
 * NOTE: This relies on document.referrer not being spoofable by the host page.
 * 
 */
function getParentOrigin() {
  var a = document.createElement("a");
  a.href = document.referrer;
  a.style.display = "none";
  document.body.appendChild(a);
  const origin = a.origin;
  document.body.removeChild(a);
  return origin; 
}

const parentOrigin = getParentOrigin();

const ourOrigin = window.location.origin;


/**
 * Handler for messages from parent. 
 */
window.addEventListener('message', async (ev) => {
  
  if (ev.origin !== parentOrigin || ev.source !== window.parent) {
    return;
  }

  console.log(`Sandbox got message from parent origin: ${parentOrigin}`, ev.data);
  
  if (ev.data.action === 'login') {
    
    const maxTime = 5000 + Date.now();
    
    let popup: Window | null | undefined = undefined;
    while (!popup && Date.now() < maxTime) {
      try {
        popup = window.open('http://localhost:1234/login.html', ev.data.windowName, "left=340,top=40,width=400,height=600", false);
      } catch (e) {
        console.error(e);
      }
      await new Promise(res => setTimeout(res, 50));
    }
    console.log(`Got popup`, popup);
    if (popup) {
      let tries = 50;
      while (tries--) {
        popup.postMessage({ action: 'login', forOrigin: parentOrigin }, ourOrigin);
        await new Promise(res => setTimeout(res, 100));
      }
    }
  }

});

/**
 * Handler for messages from our origin (the auth popups) 
 */
window.addEventListener('message', (ev) => {
  
  if (ev.origin !== ourOrigin) {
    return;
  }

  console.log(`Sandbox got message from our origin: ${ourOrigin}`);

  if (ev.data.username && ev.data.password) {
    console.log(`Login complete: ${ev.data.username} - ${ev.data.password}`);
  }
  
});

