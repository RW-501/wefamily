




	    
async function createFamilyTree() {
  try {
    const createBTN = document.getElementById('createBTN');
    createBTN.disabled = true;
	  
    const treeName = document.getElementById("tree_name").value;
    const treeLocation = document.getElementById("tree_location").value;
    const treeDescription = document.getElementById("tree_description").value;
    const familyCode = document.getElementById("tree_code").value;
    const publicBool = document.getElementById("tree_public").checked;  // Use checked property for boolean

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
  downloadURL = await uploadImageToStorage(selectedFile, storagePath);


        const docRef = await firestore.collection('familyTrees').add({
            name: treeName,
            location: [treeLocation],
            description: treeDescription,
            adminID: userID,
            public: publicBool,
            familyCode: familyCode,
            treeID: '',  // Placeholder for now
            root: '',
  ...(downloadURL && { photo: downloadURL }),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        // Update the family tree data with the generated document ID
        const generatedTreeID = docRef.id;
        await docRef.update({ treeID: generatedTreeID });

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
        await docRef.update({ treeID: generatedTreeID });

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
    });

    // Close modal and display success message
    closePopup();
    showAddMemberModal();
  } catch (error) {
    console.error('Error creating family tree:', error);

    // Enable the 'createBTN' button again in case of an error
    createBTN.disabled = false;
  }
}

// Function to save the edited family tree information to Firestore
function saveEditedFamilyTree() {
	
    const newName = document.getElementById('editFamilyTreeName').value;
    const newDescription = document.getElementById('editFamilyTreeDescription').value;
    const newLocation = document.getElementById('editFamilyTreeLocation').value;

   
	
    const treeID = currentFamilyID; // Replace with actual treeID
    const treeRef = firestore.collection('familyTrees').doc(treeID);

    treeRef.update({
        name: newName,
        description: newDescription,
        location: newLocation
        // Add other fields if needed
    }).then(() => {
        console.log('Family tree information updated successfully!');
        closeEditFamilyTreePopup(); // Close the popup after saving
	    newsPost(`${userID} edited the Family Tree Info`);

    }).catch((error) => {
        console.error('Error updating family tree information:', error);
    });
}

	    