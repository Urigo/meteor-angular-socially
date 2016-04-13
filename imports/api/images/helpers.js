/**
 * Converts DataURL to Blob object
 *
 * https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
 *
 * @param  {String} dataURL
 * @return {Blob}
 */
export function dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';

    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = decodeURIComponent(parts[1]);

      return new Blob([raw], {type: contentType});
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}

/**
 * Converts Blob object to ArrayBuffer
 *
 * @param  {Blob}       blob          Source file
 * @param  {Function}   callback      Success callback with converted object as a first argument
 * @param  {Function}   errorCallback Error callback with error as a first argument
 */
export function blobToArrayBuffer(blob, callback, errorCallback) {
  const reader = new FileReader();

  reader.onload = (e) => {
    callback(e.target.result);
  };

  reader.onerror = (e) => {
    if (errorCallback) {
      errorCallback(e);
    }
  };

  reader.readAsArrayBuffer(blob);
}
