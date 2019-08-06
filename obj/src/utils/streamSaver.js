import runtime from 'serviceworker-webpack-plugin/lib/runtime';

let serviceWorker = null;
let registerPromise = null;

async function register() {
  if ('serviceWorker' in navigator) {
    const registration = await runtime.register();
    while (registration.waiting) {
      console.log('waiting', registration.waiting);
      let fn;
      await new Promise(resolve => {
        fn = resolve;
        registration.waiting.addEventListener('statechange', fn);
      });
      if (registration.waiting) {
        registration.waiting.removeEventListener('statechange', fn);
      }
    }

    if (registration.installing) {
      console.log('installing', registration.installing);
      let fn;
      await new Promise(resolve => {
        fn = resolve;
        registration.installing.addEventListener('statechange', fn);
      });
      if (registration.installing) {
        registration.installing.removeEventListener('statechange', fn);
      }
    }

    serviceWorker = registration.active;
  } else {
    throw new Error('Service Worker is not supported.');
  }
  registerPromise = null;
}

export default async function createWriteStream(filename, { contentType, size }) {
  if (!serviceWorker) {
    if (!registerPromise) {
      registerPromise = register();
    }
    await registerPromise;
  }
  const channel = new MessageChannel();

  const setupChannel = () =>
    new Promise((resolve, reject) => {
      channel.port1.onmessage = evt => {
        if (evt.data.download) {
          resolve();
          let link = document.createElement('a');
          let click = new MouseEvent('click');

          link.href = evt.data.download;
          link.dispatchEvent(click);
        }
      };
      serviceWorker.postMessage({ filename, size, contentType }, [channel.port2]);
    });

  return new WritableStream({
    start(error) {
      // is called immediately, and should perform any actions
      // necessary to acquire access to the underlying sink.
      // If this process is asynchronous, it can return a promise
      // to signal success or failure.
      return setupChannel();
    },
    write(chunk) {
      // is called when a new chunk of data is ready to be written
      // to the underlying sink. It can return a promise to signal
      // success or failure of the write operation. The stream
      // implementation guarantees that this method will be called
      // only after previous writes have succeeded, and never after
      // close or abort is called.

      // TODO: Kind of important that service worker respond back when
      // it has been written. Otherwise we can't handle backpressure
      channel.port1.postMessage(chunk);
    },
    close() {
      channel.port1.postMessage('end');
    },
    abort(e) {
      channel.port1.postMessage('abort');
    },
  });
}
