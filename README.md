# pw-wallet

Incredibly simple demo of a sandboxed iframe holding an Arweave private key.

To run:

`npm run wallet-app`

And in another terminal:

`npm run client-app`

Running the client app will open a browser window. The iframe (the wallet app) is running on the origin `localhost:1234` while the 'dapp' test client is running on the origin `localhost:9999` 

Clicking the login button will open a popup, *on the wallet-app origin*, and entering a username & password will deterministically generate a RSA key pair, and pass it back to the iframe sandbox.

The next steps would be for the iframe sandbox/wallet-app to provide an  postMessage based API to the dApp that has embedded it, that provides methods to authorize a transaction or signature using the private key. Something like <https://www.npmjs.com/package/penpal> can be used to build that api.

Typically with these types of login systems, the iframe is set to absolute positions, hidden/shown, resizes, and shows different dialog, depending on the embedding app instructions ( show login button, auth dialog, etc )

You can look at how <https://portis.io> do it with their demo app: <https://cryptopuppers.co/> 

Note: This uses the human-crypto-keys package to deterministically generate an RSA key-pair. This is one method of doing it, just for demo purposes. Another would be to encrypt and store the wallet on chain. I'm not sure of the security of generating an rsa key pair with this library. especially as it uses a ton of Js based (not window.crypto) crypto. It's also pretty slow.