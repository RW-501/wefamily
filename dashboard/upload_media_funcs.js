const timelinePopup = document.getElementById('timelinePopup');
let downloadURL = "";
const fileInput = document.getElementById('familyTimelineFiles');
const progressBar = document.getElementById('progress-bar');
let metadata = '';
let exifData = '';
let fileType = '';

async function uploadFileToStorage(file) {
  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(file.name);

  try {
    const snapshot = await fileRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  } catch (error) {
    throw new Error('Error uploading file to storage: ' + error.message);
  }
}



fileInput.addEventListener('change', async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
  let uploadedSize = 0;

  for (const file of files) {
    try {
      // Step 1: Extract metadata
      metadata = await getPictureMetadata(file);
      fileType = file.type;

      // Step 2: Extract Exif data
      exifData = await extractExifData(file);

      // Display extracted metadata and Exif data (optional)
      console.log('Metadata:', metadata);
      console.log('Exif Data:', exifData);

      // Step 2: Upload file to storage and get download URL
      downloadURL = await uploadFileToStorage(file);
      openMediaPopup();

      const mediaPreview = document.getElementById('media-preview');

      // Step 2: Display preview of the uploaded file
      let previewElement;
      if (fileType.startsWith('image')) {
        previewElement = document.createElement('img');
      } else if (fileType.startsWith('video')) {
        previewElement = document.createElement('video');
        previewElement.controls = true; // Add controls for video playback
      }

      previewElement.src = downloadURL;
      mediaPreview.appendChild(previewElement);

      // Step 3: Save event details
      saveEventDetailsFromPopup();

      // Step 2: Update progress bar
      uploadedSize += file.size;
      const overallProgress = (uploadedSize / totalSize) * 100;
      progressBar.style.width = `${overallProgress}%`;
    } catch (error) {
      console.error('Error processing file:', error);
    }
  }
});

// Rest of the functions remain the same...

function saveEventDetailsFromPopup() {
  // Step 3: Collect event details
  const eventDate = input(document.getElementById('event-date-input').value);
  const eventLocation = input(document.getElementById('event-location-input').value);
  const eventCaption = input(document.getElementById('event-caption-input').value);
  const eventGroup = input(document.getElementById('event-Group-input').value);
const publicBool = input(document.getElementById('event-Pubic-input').checked);

  const selectedFamilyMembers = getSelectedFamilyMembers();
const reactions = [
  {
    type: 'likes',
    count: 0
  },
  {
    type: 'loves',
    count: 0
  }
];

const exifProperties = exifData || {}; // Ensure exifData is defined

	
const xResolution = parseFloat(exifProperties.XResolution.toString());

const imageCreationDate = exifProperties.DateTimeOriginal || ''; // Date and Time of Image Creation
const fileModifiedDate = exifProperties.FileModifyDate || ''; // Date and Time when File was Modified
const gpsLatitude = exifProperties.GPSLatitude || ''; // GPS Latitude
const gpsLongitude = exifProperties.GPSLongitude || ''; // GPS Longitude
const gpsAltitude = exifProperties.GPSAltitude || ''; // GPS Altitude
const orientation = exifProperties.Orientation || ''; // Orientation of the image


	
const eventData = {
  metaData: metadata,
  exifData: {
    XResolution: xResolution, // Use the converted standard number here
    imageCreationDate:imageCreationDate,
    fileModifiedDate:imageCreationDate,
    gpsLatitude:fileModifiedDate,
    gpsLongitude:gpsLongitude,
    gpsAltitude:gpsAltitude,
    orientation:orientation,
    // ... other exifData properties
  },
  downloadURL, 
    group: eventGroup,
    mediaType: fileType,
    memberName: Current_USERNAME,
    familyID: currentFamilyID,
    memberID: Current_MEMBERID,
    eventDate: eventDate,
    eventLocation: eventLocation,
    eventCaption: eventCaption,
    familyMembers: selectedFamilyMembers,
    viewed: 0,
    public: publicBool,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    reactions: [reactions],
  };
//reactions.find(reaction => reaction.type === 'likes').count += 1;

// reactions.find(reaction => reaction.type === 'loves').count += 1;


	

  // Add the data to the "familyTimeline" collection
  const db = firebase.firestore();
  db.collection('familyTimeline').add(eventData)
    .then((docRef) => {
      console.log('Event data added with ID:', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding event data:', error);
    });
}

// Other functions remain the same...

function closeMediaPopup() {
  timelinePopup.style.display = 'none';

}
function openMediaFile() {
  fileInput.click();
}
function openMediaPopup() {

  // Show the popup
  timelinePopup.style.display = 'block';

	  // Simulate a click on the file input
}








function getPictureMetadata(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const image = new Image();
      image.src = event.target.result;

      image.onload = function () {
        const metadata = {
          name: file.name,
          type: file.type,
          size: file.size, // in bytes
          width: this.width, // image width
          height: this.height, // image height
        };

        resolve(metadata);
      };

      image.onerror = function () {
        reject(new Error('Failed to load image.'));
      };
    };

    reader.onerror = function () {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsDataURL(file);
  });


// Assume you have an HTML element with id "event-date-input" for event date input

const familyMemberCheckboxContainer = document.getElementById('family-member-checkbox-container');
//window.onload = function () {

// Populate the family member checkboxes
memberDataMap.forEach((member) => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = member.memberID;
  checkbox.id = `checkbox-${member.memberID}`;
  
  const label = document.createElement('label');
  label.htmlFor = `checkbox-${member.memberID}`;
  label.textContent = member.name;

  familyMemberCheckboxContainer.appendChild(checkbox);
  familyMemberCheckboxContainer.appendChild(label);
});
//};



	
}

function BinaryFile(data) {
  this.data = data;
  this.length = data.byteLength;
  this.position = 0;
}

BinaryFile.prototype.readUint8 = function () {
  if (this.position >= this.length) {
    throw new Error('Attempt to read beyond end of file');
  }
  return this.data.getUint8(this.position++);
};

function extractExifData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const arrayBuffer = event.target.result;

      // Ensure that the result is ArrayBuffer
      if (arrayBuffer instanceof ArrayBuffer) {
        try {
          const exif = EXIF.readFromBinaryFile(arrayBuffer);
          resolve(exif);
        } catch (error) {
          reject(new Error('Error parsing EXIF data: ' + error.message));
        }
      } else {
        reject(new Error('Result is not an ArrayBuffer.'));
      }
    };

    reader.onerror = function () {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}



function findEXIFinJPEG(fileBuffer) {
  const dataView = new DataView(fileBuffer);

  if (dataView.getUint8(0) !== 0xFF || dataView.getUint8(1) !== 0xD8) {
    console.error('Not a valid JPEG file'); // Check for valid JPEG header
    return null;
  }

  const length = dataView.byteLength;
  let offset = 2;

  while (offset < length) {
    if (dataView.getUint8(offset) !== 0xFF) {
      console.error('Invalid marker found at offset ' + offset);
      return null; // Not a valid marker, something is wrong
    }

    const marker = dataView.getUint8(offset + 1);

    // Check for APP1 marker (where EXIF data is stored)
    if (marker === 0xE1) {
      return readEXIFData(dataView, offset + 4);
    } else {
      offset += 2 + dataView.getUint16(offset + 2);
    }
  }

  return null; // No EXIF data found
}

	    
// Function to get selected family members
function getSelectedFamilyMembers() {
  const selectedMembers = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach((checkbox) => {
    selectedMembers.push(checkbox.value);
  });
  return selectedMembers;
}



