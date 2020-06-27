import { getParentOrigin } from "./get-parent-origin";

const parentOrigin = getParentOrigin();

export interface LoginPopupResult {
  status: 'cancelled' | 'success',
  jwk: any,
}

export function runLoginPopup(): Promise<LoginPopupResult> {
  return new Promise((res, rej) => {
    
    // Open popup or fail.
    const popup = window.open('/login.html', 'pw-wallet-login', "left=200,top=400,width=500,height=500", true);
    if (!popup) {
      rej(`Unable to open login window`);
      return;
    }

    // Handler for login result. 
    const handleLoginResult = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin) {
        return; 
      }
      if (ev.data.action === 'loginSuccess') {
        removeHandlers();
        res({ status: 'success', jwk: ev.data.jwk });
        popup.close();
      }
    }
    
    // If popup is closed, resolve with cancelled status.
    const handlePopupUnLoad = () => {
      removeHandlers();
      res({ status: 'cancelled', jwk: undefined });
    }

    // If we are closed, close the popup and resolve with cancelled status.
    const handleUsClose = () => {
      removeHandlers();
      popup.close();
      res({ status: 'cancelled', jwk: undefined });
    }

    // Once the popup loads, send a message to start the login process, passing
    // the origin of our parent page.
    const handlePopupLoad = () => {
      popup.postMessage({ action: 'login', forOrigin: parentOrigin }, window.location.origin);
    }

    // Cleanup all the handlers.
    const removeHandlers = () => {
      window.removeEventListener('message', handleLoginResult);
      window.removeEventListener('onbeforeunload', handleUsClose);
      popup.removeEventListener('load', handlePopupLoad);
      popup.removeEventListener('onbeforeunload', handlePopupLoad);
    }

    // Setup handlers.
    window.addEventListener('message', handleLoginResult);
    window.addEventListener('beforeunload', handleUsClose);
    popup.addEventListener('load', handlePopupLoad);
    popup.addEventListener('beforeunload', handlePopupUnLoad);
  
  })
}