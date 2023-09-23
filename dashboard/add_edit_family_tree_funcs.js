




	    
async function createFamilyTree() {
  try {
    const createBTN = document.getElementById('createBTN');
    createBTN.disabled = true;
	  
  const treeName = input(document.getElementById('tree_name').value || '');
const treeLocation = input(document.getElementById('tree_location').value || '');
const treeDescription = input(document.getElementById('tree_description').value || '');
const familyCode = input(document.getElementById('tree_code').value || '');
const publicBool = input(document.getElementById('tree_public').checked);

    if (!treeName || !treeLocation || !familyCode || !userID) {
      showMainMessage("Please fill in all required fields.");
      return;
    }

    const existingTreePromise = firestore
      .collection('familyTrees')
      .where('familyCode', '==', familyCode)
      .get();

    const existingTree = await existingTreePromise;

    if (!existingTree.empty) {
      showMainMessage("A family tree with this family code already exists.");
      return Promise.reject("Family tree with the same family code exists.");
    }


	    
    let downloadURL = '';  // Initialize downloadURL

    // Upload family tree image if selected
    const selectedFile = document.getElementById('family_Tree_Image').files[0];
if (selectedFile) {
  const storagePath = 'family_Tree_Image';
      uploadImageToStorage(selectedFile, storagePath, async (downloadURL) => {

// Split the string into an array based on commas
const locationArray = treeLocation.split(',');

// Upload the data to Firestore with the location as an array
const docRef = await firestore.collection('familyTrees').add({
    name: treeName,
    location: locationArray,  // Use the array of locations
    description: treeDescription,
    adminID: userID,
    public: publicBool,
    familyCode: familyCode,
    treeID: '',  // Placeholder for now
    root: '',
    photo: downloadURL,  // Update the photo URL
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
}).catch(error => {
    console.error('Error uploading edited photo:', error);
});

        // Update the family tree data with the generated document ID
        const generatedTreeID = docRef.id;
await userDocRef.update({
    userTrees: firebase.firestore.FieldValue.arrayUnion({
        id: generatedTreeID,
        name: treeName
    })
});
	      });
        // Assign the generated tree ID to currentFamilyID
        currentFamilyID = generatedTreeID;
	    
    } else {

	
        const docRef = await firestore.collection('familyTrees').add({
            name: treeName,
            location: [treeLocation],
            description: treeDescription,
            adminID: userID,
            public: publicBool,
            familyCode: familyCode,
            treeID: '',  // Placeholder for now
            root: '',
            photo: '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        // Update the family tree data with the generated document ID
        const generatedTreeID = docRef.id;
await userDocRef.update({
    userTrees: firebase.firestore.FieldValue.arrayUnion({
        id: generatedTreeID,
        name: treeName
    })
});
        // Assign the generated tree ID to currentFamilyID
        currentFamilyID = generatedTreeID;
    }
	    
   const userDocRef = firestore.collection('users').doc(userID);
    const userDoc = await userDocRef.get();
    const docData = userDoc.data();

    // Update the 'userTrees' array by adding a new tree ID
    userDocRef.update({
      userTrees: firebase.firestore.FieldValue.arrayUnion(currentFamilyID)
    })
    .then(() => {
      document.getElementById("member-first_name").value = docData.userName;
      document.getElementById("member-birthdate").value = docData.birthday;
      document.getElementById("member_Image").src = docData.photo;
    
      console.log('UserTrees array updated with a new tree ID.');
    })
    .catch((error) => {
      console.error('Error updating userTrees array:', error);
    })
    .finally(() => {
      // Enable the 'createBTN' button again after the operation (success or error)
      createBTN.disabled = false;
    // Close modal and display success message
    closePopup();
    showAddMemberModal();
    });


  } catch (error) {
    console.error('Error creating family tree:', error);

    // Enable the 'createBTN' button again in case of an error
    createBTN.disabled = false;
  }
}






async function saveEditedFamilyTree() {
  try {
  const newName = input(document.getElementById('editFamilyTreeName').value || '');
const newDescription = input(document.getElementById('editFamilyTreeDescription').value || '');
const newLocation = input(document.getElementById('editFamilyTreeLocation').value || '');


    if (!newName) {
      console.error('Name is empty or undefined.');
      return;
    }

    const storagePath = 'family_Tree_Image';
    const treeID = currentFamilyID;
    const treeRef = firestore.collection('familyTrees').doc(treeID);

    // Upload family tree image if selected
    const selectedFile = document.getElementById('family_Tree_ImageEdit').files[0];

    if (selectedFile) {
      // Handle uploading the edited photo and get the download URL
      uploadImageToStorage(selectedFile, storagePath, async (downloadURL) => {
	      // Update the document with the new data including the photo URL
     // Update the family tree information in Firestore
    await treeRef.update({
      name: newName,
      description: newDescription,
      location: newLocation,
      photo: downloadURL  // Update the photo URL
      // Add other fields as needed
    });

    console.log('Family tree information updated successfully!');
    closeEditFamilyTreePopup(); // Close the popup after saving
    newsPost(`${userID} edited the Family Tree Info`);
      }).catch(error => {
        console.error('Error uploading edited photo:', error);
      });
    } else {
    // Update the family tree information in Firestore
    await treeRef.update({
      name: newName,
      description: newDescription,
      location: newLocation,
      // Add other fields as needed
    });

    console.log('Family tree information updated successfully!');
    closeEditFamilyTreePopup(); // Close the popup after saving
    newsPost(`${userID} edited the Family Tree Info`);
    }
  } catch (error) {
    console.error('Error saving edited family member:', error);
  }
}

	    
