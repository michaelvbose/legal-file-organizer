console.log('hallogallo');

let fileHandle;

let butOpenFile = document.getElementById('butOpen');
let textArea = document.getElementById('textarea');


// there might be a way to just look into the metadata

// these values (author, etc. ) are taken from the heading of the document
function fileMetadata(filename, size, date, author) {
  this.filename = filename;
  this.size = size; // in KB
  this.date = date; // datetime operations and format
  this.author = author;
  return { filename, size, date, author };
}

const file1 = fileMetadata('file1.docx', '128', 'December 19, 2019', 'Jane Doe');
const file2 = fileMetadata('file2_newname.docx', '256', '12/20/2025', 'Jane Doe');
const file3 = fileMetadata('FILE3.docx', '9123', '02/20/2010', 'John Doe');
console.log('file1.author = ' + file1.author);


butOpenFile.addEventListener('click', async () => {
    // Destructure the one-element array.
    [fileHandle] = await window.showOpenFilePicker();
    // Do something with the file handle.
    const file = await fileHandle.getFile();
    const contents = await file.text();
    // console.log("filename = " + fileHandle.name);
    textArea.value = contents;
});

let saveFile = document.getElementById('saveFile');

async function getNewFileHandle() {
    const options = {
        types: [
            {
                description: 'Text Files',
                accept: {
                    'text/plain': ['.txt'],
                },
            },
        ],
    };
    const handle = await window.showSaveFilePicker(options);
    return handle;
}

/**
 * Verify the user has granted permission to read or write to the file, if
 * permission hasn't been granted, request permission.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to check.
 * @param {boolean} withWrite True if write permission should be checked.
 * @return {boolean} True if the user has granted read/write permission.
 */

async function verifyPermission(fileHandle, withWrite) {
  const opts = {};
  if (withWrite) {
    opts.writable = true;
    // For Chrome 86 and later...
    opts.mode = 'readwrite';
  }
  // Check if we already have permission, if so, return true.
  if (await fileHandle.queryPermission(opts) === 'granted') {
    return true;
  }
  // Request permission to the file, if the user grants permission, return true.
  if (await fileHandle.requestPermission(opts) === 'granted') {
    return true;
  }
  // The user did nt grant permission, return false.
  return false;
}