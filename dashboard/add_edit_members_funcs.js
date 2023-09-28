



    function editMemberFunc(memberData,memberId){

		    if(memberData === ""){

   memberData = findMemberById(memberId);
            console.log('memberData.first_name    '+memberData.first_name);

		    }
 document.getElementById('edit-first-name').value = memberData.first_name || '';
    document.getElementById('edit-last-name').value = memberData.last_name || '';
    document.getElementById('edit-middle-name').value = memberData.middle_name || '';
    document.getElementById('nameSuffix').value = memberData.nameSuffix || '';
    document.getElementById('edit-birthdate').value = memberData.birthdate || '';
    document.getElementById('edit-bio').value = memberData.bio || '';
    document.getElementById('edit-deceaseddate').value = memberData.deceaseddate || '';
    document.getElementById('edit-contact').value = memberData.contact || '';
    document.getElementById('edit-private').value = memberData.private || '';
    document.getElementById('edit-note').value = memberData.note || '';
    document.getElementById('userID_edit_Member').innerHTML = memberData.memberID || '';

		         document.getElementById('edit_member_Image').src = memberData.photo || "/wefamily/images/memberPlaceholder.jpg" ;

    document.getElementById('edit-family-member-popup').style.display = 'block';


		    
//showMainMessage(`${userID} edit ${memberData.first_name} ${memberData.last_name} `);

	    }
function removeFamilyMember() {

	
const memberID = document.getElementById('userID_edit_Member').innerText;
    const memberRef = firebase.firestore().collection('familyMembers').doc(memberID);

    memberRef.delete()
        .then(() => {
            console.log('Family member successfully deleted.');
            // Add any other actions you want to take after successful deletion
		                      
	newsPost(`${userID} removed ID: ${memberID}`);
closeEditFamilyMemberPopup();
        })
        .catch((error) => {
            console.error('Error removing family member:', error);
        });
}


async function saveEditedFamilyMember() {
  try {
const editedFirstNameBefore = document.getElementById('edit-first-name').value || '';
const editedLastNameBefore = document.getElementById('edit-last-name').value || '';
const editedMiddleNameBefore = document.getElementById('edit-middle-name').value || '';
const nameSuffixBefore = document.getElementById('nameSuffix').value || '';
const editedBirthdateBefore = document.getElementById('edit-birthdate').value || '';
const editedBioBefore = document.getElementById('edit-bio').value || '';
const editedDeceasedDateBefore = document.getElementById('edit-deceaseddate').value || '';
const editedContactBefore = document.getElementById('edit-contact').value || '';
const editedPrivateBefore = document.getElementById('edit-private').value || '';
const editedNoteBefore = document.getElementById('edit-note').value || '';
const memberIDBefore = document.getElementById('userID_edit_Member').innerText || '';

// Assuming input is a function that processes the input in a certain way
const editedFirstName = input(editedFirstNameBefore);
const editedLastName = input(editedLastNameBefore);
const editedMiddleName = input(editedMiddleNameBefore);
const nameSuffix = input(nameSuffixBefore);
const editedBirthdate = input(editedBirthdateBefore);
const editedBio = input(editedBioBefore);
const editedDeceasedDate = input(editedDeceasedDateBefore);
const editedContact = input(editedContactBefore);
const editedPrivate = input(editedPrivateBefore);
const editedNote = input(editedNoteBefore);
const memberID = input(memberIDBefore);

    // Use appropriate method to get photo data
    const selectedFile = document.getElementById('edit-photo-file').files[0];

    // Check if memberID is empty or undefined
    if (!memberID) {
      console.error('Member ID is empty or undefined.');
      return;
    }

    const memberRef = firebase.firestore().collection('familyMembers').doc(memberID);

    if (selectedFile) {
      // Handle uploading the edited photo and get the download URL
      uploadImageToStorage(selectedFile, 'member_main_Image', async (downloadURL) => {
        // Update the document with the new data including the photo URL
        await memberRef.update({
          first_name: editedFirstName,
          last_name: editedLastName,
          middle_name: editedMiddleName,
          nameSuffix: nameSuffix,
          birthdate: editedBirthdate,
          bio: editedBio,
          deceaseddate: editedDeceasedDate,
          contact: editedContact,
          private: editedPrivate,
          note: editedNote,
          photo: downloadURL,
          // Add other fields as needed
        });

        console.log('Family member updated successfully.');
        // Close the edit family member popup
        closeEditFamilyMemberPopup();
      }).catch(error => {
        console.error('Error uploading edited photo:', error);
      });
    } else {
      // Update the document with the new data (excluding the photo URL)
      await memberRef.update({
        first_name: editedFirstName,
        last_name: editedLastName,
        middle_name: editedMiddleName,
        nameSuffix: nameSuffix,
        birthdate: editedBirthdate,
        bio: editedBio,
        deceaseddate: editedDeceasedDate,
        contact: editedContact,
        private: editedPrivate,
        note: editedNote,
        // Add other fields as needed
      });

      console.log('Family member updated successfully.');
      // Close the edit family member popup
      closeEditFamilyMemberPopup();
    }
  } catch (error) {
    console.error('Error saving edited family member:', error);
  }
}




function closeEditFamilyMemberPopup() {

    document.getElementById('edit-family-member-popup').style.display = 'none';
}




function addNewFamilyMember() {
    // Get input values
const first_name = input(document.getElementById('member-first_name_type').value || '');
const last_name = input(document.getElementById('member-last_name_type').value || '');
const birthdate = input(document.getElementById('member-birthdate_type').value || '');
const deceaseddate = input(document.getElementById('member-deceaseddate_type').value || '');
const note = input(document.getElementById('member-note_type').value || '');


    if (!first_name && !last_name) {
        return;
    }

    // Create a new family member document and add it to the database
    const familyMember = {
        first_name: first_name,
        last_name: last_name,
        middle_name: '',
          nameSuffix:"",
        location: "",
        birthdate: birthdate,
        deceaseddate: deceaseddate,
	    photo: '',
        private: false,
        addByID: userID,
        familyID: [currentFamilyID], // Initialize familyID as an array with currentFamilyID
        bio: "",
        userID: "",
        memberID: "",
        spouse: [],
        parents: [],
        sibling: [],
        children: [],
        contact: '',
        note: note,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),

        // Add other fields as needed
    };

    // Add the family member to the 'familyMembers' collection
    firestore.collection('familyMembers').add(familyMember)
        .then((docRef) => {
       
               let newID = docRef.id;


           
			
const selectedFile = document.getElementById('newMember_main_Image').files[0]; // Get the selected file

		if(!selectedFile){
     firestore.collection('familyMembers').doc(docRef.id).update({
                                    memberID: newID,
                                })
                                .then(() => {

                              console.log('Photo URL added to family tree document.');
console.log('addFamily_Type :', addFamily_Type);
console.log('addFamily_MemberID :', addFamily_MemberID);
console.log('newID :', newID);

                    if (addFamily_Type === "Parent") {
                        addChildToParent(newID, addFamily_MemberID);
                        newsPost(`${userID} added ${addFamily_MemberData.first_name} ${addFamily_MemberData.last_name} as ${familyMember.first_name} ${familyMember.last_name} Parent`);
                    }  
		    
	    if (addFamily_Type === "Child") {
                        addParentToChild( newID, addFamily_MemberID);
                        newsPost(`${userID} added ${addFamily_MemberData.first_name} ${addFamily_MemberData.last_name} as ${familyMember.first_name} ${familyMember.last_name} Child`);
                    } 

					
					      // Display updated family members
                          //   fetchFamilyTree();

    // Close the modal after adding the member
    closeAddMemberTypePopup();	
                                })
                                .catch((error) => {
                                    console.error('Error adding photo URL to family tree document:', error);
                                });
		}else{
// Upload an image to gs://wefamily-44c0b.appspot.com/member_main_Image
uploadImageToStorage(
  selectedFile,
  'newMember_main_Image',
  (downloadURL) => {
    console.log('Image uploaded successfully to member_main_Image:', downloadURL);
    // Handle success, e.g., save the downloadURL to your database
   // Update the family tree document with the photo URL
                                firestore.collection('familyMembers').doc(docRef.id).update({
                                    memberID: newID,
                                    photo: downloadURL,
                                })
                                .then(() => {
                                    console.log('Photo URL added to family tree document.');
console.log('addFamily_Type :', addFamily_Type);
console.log('addFamily_MemberID :', addFamily_MemberID);
console.log('newID :', newID);

                    if (addFamily_Type === "Parent") {
                        addParentToChild(newID, addFamily_MemberID);
                        newsPost(`${userID} added ${addFamily_MemberData.first_name} ${addFamily_MemberData.last_name} as ${familyMember.first_name} ${familyMember.last_name} Child`);
                    }  
		    
	    if (addFamily_Type === "Child") {
                        addChildToParent( newID, addFamily_MemberID);
                        newsPost(`${userID} added ${addFamily_MemberData.first_name} ${addFamily_MemberData.last_name} as ${familyMember.first_name} ${familyMember.last_name} Parent`);
                    } 


	
// Clear input values
document.getElementById('member-first_name_type').value = '';
document.getElementById('member-last_name_type').value = '';
document.getElementById('member-birthdate_type').value = '';
document.getElementById('member-deceaseddate_type').value = '';
document.getElementById('member-note_type').value = '';
					
                                                fetchFamilyTree();

    // Close the modal after adding the member
    closeAddMemberTypePopup();

	
                                })
                                .catch((error) => {
                                    console.error('Error adding photo URL to family tree document:', error);
                                });
	  
  },
  (error) => {
    console.error('Image upload error:', error);
    // Handle error, e.g., display an error message to the user
  }
);

		}
                })
                .catch((error) => {
                    console.error('Error updating family member:', error);
                });
      

}

// Add an event listener to the form submission
document.getElementById('add-member-type').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    // Call the function to add the family member
    addNewFamilyMember();
});


	    
    function addParent(member) {

	    	if(getParentNames(member.memberID) === null){
// console.log('setRootValue memberID.',memberID);

showAddMemberTypePopup("Parent");
	    addFamily_MemberID = member.memberID;
	    addFamily_Type = 'Parent';
addFamily_MemberData = member;
}else{
openCreateTreePopup();
}
    }

 

    function addChild(member) {
             //       console.log('member:'+ member);

        // Add child logic here
showAddMemberTypePopup("Child");
	    addFamily_MemberID = member.memberID;
	    addFamily_Type = 'Child';
addFamily_MemberData = member;

    }

 
	    
// Function to add a parent to a child
async function addParentToChild(newID, theFamilyMember) {
    try {
        console.log('addParentToChild newID:', newID);
        console.log('addParentToChild addFamily_MemberID:', theFamilyMember);
      // showMainMessage(newID+' newID  addFamily_MemberID:', addFamily_MemberID);

        const childRef = firestore.collection('familyMembers').doc(theFamilyMember);

        // Update the parent's children array to include the child's ID
        await childRef.update({
            children: firebase.firestore.FieldValue.arrayUnion(newID)
        });

        await setRootValue(newID);
  await resetFamilyTree();


    } catch (error) {
        console.error('Error adding parent to child:', error);
    }
}

async function addChildToParent(newID, theFamilyMember) {
    try {
  
	          console.log('addChildToParent newID:', newID);
        console.log('addChildToParent addFamily_MemberID:', theFamilyMember);  
   //    showMainMessage(newID+' newID  addFamily_MemberID:', addFamily_MemberID);

        const parentRef = firestore.collection('familyMembers').doc(newID);

        // Update the child's parent array to include the parent's ID
        await parentRef.update({
            children: firebase.firestore.FieldValue.arrayUnion(theFamilyMember)
        });

  await resetFamilyTree();

    } catch (error) {
        console.error('Error adding child to parent:', error);
    }
}





	    
// Function to add spouses to each other's spouse arrays
function addSpouseToMember(newID, addFamily_MemberID) {
    const memberRef1 = firestore.collection('familyMembers').doc(newID);
    const memberRef2 = firestore.collection('familyMembers').doc(addFamily_MemberID);

    // Update the spouse arrays for both members
    memberRef1.update({
        spouse: firebase.firestore.FieldValue.arrayUnion(addFamily_MemberID)
    });

    memberRef2.update({
        spouse: firebase.firestore.FieldValue.arrayUnion(newID)
    });
}

    
 // Function to add siblings to each other's sibling arrays
function addSiblingToMember(newID, addFamily_MemberID) {
    const memberRef1 = firestore.collection('familyMembers').doc(newID);
    const memberRef2 = firestore.collection('familyMembers').doc(addFamily_MemberID);

    // Update the sibling arrays for both members
    memberRef1.update({
        sibling: firebase.firestore.FieldValue.arrayUnion(addFamily_MemberID)
    });
    
    memberRef2.update({
        sibling: firebase.firestore.FieldValue.arrayUnion(newID)
    });
}

            




// Function to add a family member
function addFamilyMember() {
	                    console.log('Added Member.');

    // Get input values
const first_name = input(document.getElementById('member-first_name').value || '');
const last_name = input(document.getElementById('member-last_name').value || '');
const birthdate = input(document.getElementById('member-birthdate').value || '');
const isPrivate = input(document.getElementById('member-private').checked);
const contact = input(document.getElementById('member-contact').value || '');
const note = input(document.getElementById('member-note').value || '');


if(!first_name && !last_name){
		return;
	}
    // You can perform data validation and error handling here

    // Create a new family member document and add it to the database
    const familyMember = {
        first_name: first_name,
        last_name: last_name,
	 middle_name: "",
          nameSuffix: "",
        location: "",
        birthdate: birthdate,
        deceaseddate: "",
        photo: '',
        private: isPrivate,
        addByID: userID,
        familyID: [currentFamilyID], // Initialize familyID as an array with currentFamilyID
        userID: "",
        bio: "",
        memberID: "",
        spouse: [],
        parents: [],
        sibling: [],
	    children: [],
        contact: contact,
        note: note,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),

        // Add other fields as needed
    };
let memberID;
// Add the family member to the 'familyMembers' collection
firestore.collection('familyMembers').add(familyMember)
    .then((docRef) => {
     
	    memberID = docRef.id;

	    		    console.log("- new memberID   " + memberID);

const selectedFile = document.getElementById('member_main_Image').files[0]; // Get the selected file
		if(!selectedFile){
		//	const picURL = document.getElementById("member_Image").src;
  firestore.collection('familyMembers').doc(memberID).update({
                                    memberID: memberID,
                                 //   photo: picURL,
                                })
                                .then(() => {
                                    console.log('Photo URL added to family tree document.');
					  // displayFamilyMembers(currentFamilyID);
					checkFirstMember(currentFamilyID,memberID);
   resetFamilyTree();
					//loadFamilyTreeChart(treeData);
//document.getElementById("member_Image").src = "/images/memberPlaceholder.jpg";
                                })
                                .catch((error) => {
                                    console.error('Error adding photo URL to family tree document:', error);
                                });

		}else{
// Upload an image to gs://wefamily-44c0b.appspot.com/member_main_Image
uploadImageToStorage(
  selectedFile,
  'member_main_Image',
  (downloadURL) => {
    console.log('Image uploaded successfully to member_main_Image:', downloadURL);
    // Handle success, e.g., save the downloadURL to your database
   // Update the family tree document with the photo URL
                                firestore.collection('familyMembers').doc(memberID).update({
                                    photo: downloadURL,
                                    memberID: memberID,
                                })
                                .then(() => {
					
                                    console.log('Photo URL added to family tree document.');
					//   displayFamilyMembers(currentFamilyID);
					checkFirstMember(currentFamilyID,memberID);
                fetchFamilyTree();
					//loadFamilyTreeChart(treeData);

                                })
                                .catch((error) => {
                                    console.error('Error adding photo URL to family tree document:', error);
                                });
	  
  },
  (error) => {
    console.error('Image upload error:', error);
    // Handle error, e.g., display an error message to the user
  }	
);


		}
	    

  })
                                .catch((error) => {
                                    console.error('Error adding photo URL to family tree document:', error);
                                });
	  

    // Close the modal after adding the member
    closeAddMemberModal();
}



	  
document.getElementById('add-member-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission
    addFamilyMember(); // Call the function to add the family member
});
