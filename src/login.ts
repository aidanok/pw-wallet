

// @ts-ignore
import { getKeyPairFromSeed } from 'human-crypto-keys';
// @ts-ignore
import rsaPemToJwk from 'rsa-pem-to-jwk';


const myOrigin = window.location.origin;

let sourceWindow: Window | undefined = undefined;

window.addEventListener('message', (ev) => {

  console.log(`Got ev`, ev.data);

  // Ignore messages that have no data or that are not 
  // from our own origin.
  if (!ev.data || ev.origin !== myOrigin) {
    return;
  }
  
  // TODO: more checks that is is a Window object exactly.
  if (!ev.source) {
    throw new Error(`Event has no source`);
  }

  if (ev.data.action === 'login') {
    const infoTextEl = document.getElementById('info-text')!
    infoTextEl.textContent = `${ev.data.forOrigin} is asking to Login`;
    sourceWindow = ev.source as Window;
  }
  
})


document.getElementById('loginButton')!.onclick = finishLogin;

async function finishLogin() {
  try {
    document.getElementById('loginButton')!.innerText = "Regenerating key.."; 
    (document.getElementById('loginButton')! as HTMLInputElement).disabled = true;
    
    const username = document.getElementById('username')! as HTMLInputElement
    const password = document.getElementById('password')! as HTMLInputElement 
    if (!sourceWindow) {
      throw new Error(`Dont have source window yet`);
    }
    const keyPair = await getKeyPairFromSeed(`${username}${password}`, { id: 'rsa', modulusLength: 4096 }, { privateKeyFormat: 'pkcs1-pem' });
    const jwk = rsaPemToJwk(keyPair.privateKey, undefined, 'private');
    console.log(keyPair);
    console.log(jwk);
    
    sourceWindow.postMessage({ action: 'loginSuccess', jwk }, window.location.origin);
  } 
  catch (e) {
    console.error(e);
    document.getElementById('loginButton')!.innerText = "Login"; 
    (document.getElementById('loginButton')! as HTMLInputElement).disabled = false;
  }
}
