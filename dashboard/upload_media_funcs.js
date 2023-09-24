// Assume you have an HTML element with id "event-date-input" for event date input
const eventDateInput = document.getElementById('event-date-input');

// Function to save event details to Firestore
function saveEventDetailsFromPopup() {
  const downloadURL = document.getElementById('download-url-input').value;
  const eventDate = document.getElementById('event-date-input').value;
  const eventLocation = document.getElementById('event-location-input').value;
  const eventCaption = document.getElementById('event-caption-input').value;
  const selectedFamilyMembers = getSelectedFamilyMembers();

  // Prepare the data to be saved to Firestore
  const eventData = {
    downloadURL: downloadURL,
    eventDate: eventDate,
    eventLocation: eventLocation,
    eventCaption: eventCaption,
    familyMembers: selectedFamilyMembers,
  };

  // Add the data to the "familyTimeline" collection
  const db = firebase.firestore();
  db.collection('familyTimeline').add(eventData)
    .then((docRef) => {
      console.log('Event data added with ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding event data: ', error);
    });
}



function openMediaPopup(downloadURL) {
  // Display media preview
  const mediaPreview = document.getElementById('media-preview');
  mediaPreview.innerHTML = `<img src="${downloadURL}" alt="Media Preview">`;

  // Set the downloadURL in a hidden input field for later use
  const downloadURLInput = document.getElementById('download-url-input');
  downloadURLInput.value = downloadURL;

  // Show the popup
  const popup = document.getElementById('timelinePopup');
  popup.style.display = 'block';
}
	  
const fileInput = document.getElementById('familyTimelineFiles');
const progressBar = document.getElementById('progress-bar');

function uploadFileToStorage(file) {
  const storageRef = firebase.storage().ref();
  const uploadTask = storageRef.child('uploads/' + file.name).put(file);

  uploadTask.then((snapshot) => {
    snapshot.ref.getDownloadURL().then((downloadURL) => {
      console.log('Download URL:', downloadURL); // Check downloadURL

      // Call the function to save event details with the downloadURL
      saveEventDetails(downloadURL);

      // Display preview of the uploaded image
      const previewImage = document.createElement('img');
      previewImage.src = downloadURL;
      document.body.appendChild(previewImage);
    });
  });

  return uploadTask;
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



	    
function extractExifData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const exif = EXIF.readFromBinaryFile(new BinaryFile(event.target.result));
      resolve(exif);
    };

    reader.onerror = function () {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

//handleFileSelectTimeline 
fileInput.addEventListener('change', async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
  let uploadedSize = 0;

  for (const file of files) {
    try {
      const metadata = await getPictureMetadata(file);
      console.log('Metadata:', metadata);

      // Extract Exif data for time taken and location
      const exifData = await extractExifData(file);
      console.log('Exif Data:', exifData);

      const timeTaken = exifData.DateTimeOriginal || exifData.DateTime;
      const location = exifData.GPSLatitude && exifData.GPSLongitude
        ? `${exifData.GPSLatitude} ${exifData.GPSLongitude}`
        : 'Location data not available';

      console.log('Time taken:', timeTaken);
      console.log('Location:', location);
    } catch (error) {
      console.error('Error getting metadata or extracting Exif data:', error);
    }

    const uploadTask = uploadFileToStorage(file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploadedSize += snapshot.bytesTransferred;
      const overallProgress = (uploadedSize / totalSize) * 100;

      progressBar.style.width = `${overallProgress}%`;
    });
  }
});


	    
// Function to get selected family members
function getSelectedFamilyMembers() {
  const selectedMembers = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach((checkbox) => {
    selectedMembers.push(checkbox.value);
  });
  return selectedMembers;
}



