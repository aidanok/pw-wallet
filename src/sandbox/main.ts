import { connectToParent } from 'penpal';
import { html, render } from 'lighterhtml';
import { getParentOrigin } from './get-parent-origin';
import Arweave from 'arweave/web';
import { runLoginPopup } from './login-popup';


const body = document.querySelector('body')!
const arweave = Arweave.init({});

async function doLogin() {
  const result = await runLoginPopup();
  if (result.status === 'success') {
    let address = await arweave.wallets.jwkToAddress(result.jwk);
    let balance = await arweave.wallets.getBalance(address);
    render(body, loggedIn(address, balance));
  } else {
    render(body, cancelled);
  }
}

const login = 
  html`<div class="login-btn-container"><button onclick=${doLogin}>Login</div>`;

const loggedIn = (address: string, balance: string) => 
  html`<div><div>Logged in<div>Address:${address}<div>Balance:${balance}<div> Private Key: hidden</div>`

const cancelled = 
  html`<div>User cancelled.<div class="login-btn-container"><button onclick=${doLogin}>Login</div>`;

render(body, login);
