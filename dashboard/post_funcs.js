
     const post_content_Input = document.getElementById('post-content');


post_content_Input.addEventListener('keydown', function (event) {
      if ( event.key === 'Enter' ) {
        event.preventDefault();
        addPost();
      }
    });
//event.key === 'Backspace'



	    
function deletePost(postID) {
    const postRef = firestore.collection('posts').doc(postID);
    document.getElementById('pinnedFamily-news-area').innerHTML = "";
    // Delete the post document
    return postRef
        .delete()
        .then(() => {
            console.log(`Post ${postID} deleted successfully.`);
        })
        .catch((error) => {
            console.error(`Error deleting post ${postID}:`, error);
        });
}
function updatePostPinnedStatus(postID, isPinned) {

    const postRef = firestore.collection('posts').doc(postID);
    document.getElementById('pinnedFamily-news-area').innerHTML = "";

    // Update the 'pinned' field of the post document
    return postRef.update({
        pinned: isPinned ? 'true' : '', // Use 'YES' for pinned, '' for unpinned
    })
    .then(() => {
        console.log(`Post ${postID} ${isPinned ? 'pinned' : 'unpinned'} successfully.`);
    })
    .catch((error) => {
        console.error(`Error updating post ${postID} pinned status:`, error);
    });
}



	    
const menuIcon = document.querySelector('.menu-icon');
const dropdownMenu = document.querySelector('.dropdown-menu');

menuIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
});

function loadFamilyPosts() {
    const familyNewsArea = document.getElementById('family-news-area');
    familyNewsArea.innerHTML = 'Loading...';

    // Listen for changes to the posts collection (Firestore query)
firestore.collection('posts')
    .where('treeID', '==', currentFamilyID)
    .where('postType', '!=', 'news')
    .orderBy('postType') // Use 'postType' as your first orderBy field
    .orderBy('timestamp', 'asc') // Then order by 'timestamp' in descending order
    .onSnapshot((querySnapshot) => {
        familyNewsArea.innerHTML = '';
        // Your code to handle the query results
    



            querySnapshot.forEach((doc) => {
                const post = doc.data();
                const postElement = document.createElement('div');
                postElement.classList.add('post');

const jsDate = post.timestamp ? new Date(post.timestamp.seconds * 1000 + (post.timestamp.nanoseconds || 0) / 1000000) : null;
                const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
                const formattedDate = jsDate.toLocaleString('en-US', options);


               if (post.postType === 'news') {
    const postContent = `
        <p>${post.content}</p>
        <div class="space_J">
            <small>Posted by: ${post.author}</small>
            <small>Posted on: ${formattedDate}</small>
        </div>
    `;

    postElement.innerHTML = postContent;
} else if (post.postType === 'photo') {
    // Handle photo posts here
    const photoContent = `
        <div class="photo-post">
            <img src="${post.photoURL}" alt="Posted photo" />
            <p>${post.content}</p>
            <div class="space_J">
                <small>Posted by: ${post.author}</small>
                <small>Posted on: ${formattedDate}</small>
            </div>
        </div>
    `;

    postElement.innerHTML = photoContent;
} else {
    postElement.innerHTML = `
        <p>${post.content}</p>
        <div class="space_J">
            <small>Posted by: ${post.author}</small>
            <small>Posted on: ${formattedDate}</small>
        </div>
    `;
}

                familyNewsArea.appendChild(postElement);
	familyNewsArea.scrollTop = familyNewsArea.scrollHeight;

            });
        });

}



async function fetchPageMetadata(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    return {
      title: doc.querySelector('title')?.innerText,
      image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      description: doc.querySelector('meta[name="description"]')?.getAttribute('content')
    };
  } catch (error) {
    console.error('Error fetching page metadata:', error);
    return null;
  }
}


function replaceURLsWithLinks(content, url) {
  const contentWithLinks = content.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank">$1</a>'
  );

  const metadata = fetchPageMetadata(url);

  // You can now use the metadata (title, image, description) and contentWithLinks as needed.
  return { contentWithLinks, metadata };
}

function checkPostForMedia(xxx) {
  if (/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/g.test(xxx)) {
    const videoIdMatch = xxx.match(/[?&]v=([^&]+)/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return xxx + `<iframe src="${embedUrl}" width="560" height="315" class="video_iframe"></iframe>`;
    }
  } else {
   /*
	  const urlRegex = /(https?:\/\/[^\s]+)/g;
    const url = xxx.match(urlRegex);
    const { contentWithLinks, metadata } = replaceURLsWithLinks(xxx, url);
    return `${contentWithLinks}<div class="post_link_meta">${metadata}</div>`;

    */
const contentWithLinks = xxx.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank">$1</a>'
    );
	  return contentWithLinks;
  }
}

//const contentWithLinks = checkPostForMedia(post.content);


	    

function loadPosts() {
    const familyNewsArea = document.getElementById('family-news-area');
    familyNewsArea.innerHTML = 'Loading...';

    // Listen for changes to the posts collection (Firestore query)
    firestore.collection('posts')
        .where('treeID', '==', currentFamilyID) // Filter posts by treeID
        .orderBy('timestamp', 'asc') // Order by timestamp in ascending order
        .onSnapshot((querySnapshot) => {
            familyNewsArea.innerHTML = ''; // Clear the loading message

            querySnapshot.forEach((doc) => {
                const post = doc.data();
                const postElement = document.createElement('div');
                postElement.classList.add('post');
let isPinned = "";
if (post.pinned === 'true') {
	isPinned = true;
}else{
isPinned = false;
}

                const jsDate = post.timestamp ? new Date(post.timestamp.seconds * 1000 + (post.timestamp.nanoseconds || 0) / 1000000) : null;
                const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
                const formattedDate = jsDate ? jsDate.toLocaleString('en-US', options) : '';

   const pinBTN = isPinned
                        ? `<button class='pin-button' onclick='updatePostPinnedStatus("${doc.id}", false)'>Unpin Post</button>`
                        : `<button class='pin-button' onclick='updatePostPinnedStatus("${doc.id}", true)'>Pin Post</button>`;


  // Replace URLs with clickable links
//  const contentWithLinks = checkPostForMedia(post.content);
const contentWithLinks = checkPostForMedia(post.content);
		    
                if (post.postType === 'news') {
                    const postContent = `
            <p class="post_content">${contentWithLinks}</p>
                        <div class="space_J">
                            <small>Posted by: ${post.author}</small>
                            <small>Posted on: ${formattedDate}</small>
                        </div>
                    `;
                    postElement.innerHTML = postContent;
                } else if (post.postType === 'photo') {

			 // Add the "pin-post" class to pinned posts
                    if (isPinned) {
                        postElement.classList.add('pin-post');
                    }
    // Handle photo posts here
    const photoContent = `
    
        <div class="photo-post">
	                <div class="space_J">
                        <div class='pin_area'>${pinBTN}</div>
            <button class="delete-button" onclick="deletePost('${doc.id}')">Delete</button>
	    </div>
           <div class="post_img_Box"><img class="post_img" src="${post.photo}" alt="Posted photo" /></div>
            <p class="post_content">${contentWithLinks}</p>
            <div class="space_J">
                <small>Posted by: ${post.author}</small>
                <small>Posted on: ${formattedDate}</small>
            </div>
        </div>
    `;

    postElement.innerHTML = photoContent;
}else{		
                    // Add the "pin-post" class to pinned posts
                    if (isPinned) {
                        postElement.classList.add('pin-post');
                    }

                 
	    
                    postElement.innerHTML = `
		                            <div class="space_J">
                        <div class='pin_area'>${pinBTN}</div>
            <button class="delete-button" onclick="deletePost('${doc.id}')">Delete</button>
	    </div>

            <p class="post_content">${contentWithLinks}</p>
                        <div class="space_J">
                            <small>Posted by: ${post.author}</small>
                            <small>Posted on: ${formattedDate}</small>
                        </div>
                    `;
                }
                    if (isPinned) {
    document.getElementById('pinnedFamily-news-area').innerHTML = "";
document.getElementById('pinnedFamily-news-area').appendChild(postElement);
		    }else{
familyNewsArea.appendChild(postElement);
		    }
	
                familyNewsArea.scrollTop = familyNewsArea.scrollHeight;
            });
        });
}



function addPost() {
const postContent = input(document.getElementById('post-content').value || '');
    const currentUser = auth.currentUser;
	
	
	if (!postContent || !currentUser) {
        return;
    }

    const post = {
	postID: "",
        postType: "text",
        pinned: "",
        treeID: currentFamilyID,
        userID: userID,
        content: postContent,
        photo: "",
        memberPhoto: Current_USERPHOTO,
        author: currentUser.displayName || Current_USERNAME ,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };


	
    firestore
        .collection("posts")
        .add(post)
        .then((docRef) => {
            console.log("News post added successfully with ID:", docRef.id);

            // Update the postID field with the generated document ID
            const update = { postID: docRef.id };
            firestore.collection("posts").doc(docRef.id).update(update);
		document.getElementById('post-content').value = '';
	    // Get the file input element
const selectedFile = document.getElementById('members_post_images').files[0]; 
					     // Get the selected file

if(!selectedFile){
         // Update the family tree document with the photo URL
                                firestore.collection('posts').doc(docRef.id).update({
                                    postID: docRef.id,
                                  

                                })
                                .then(() => {
                                    console.log('Photo URL added to family tree document.');

                                })
                                .catch((error) => {
                                    console.error('Error adding photo URL to family tree document:', error);
                                });
}else{
					     
                        const storagePath = 'members_post_images'; // Change the storage path as needed
                        uploadImageToStorage(
                            selectedFile,
                            storagePath,
                            (downloadURL) => {
                                console.log('Image uploaded successfully:', downloadURL);
                                // Handle success, e.g., save the downloadURL to your database

                                // Update the family tree document with the photo URL
                                firestore.collection('posts').doc(docRef.id).update({
                                    postID: docRef.id,
                                    photo: downloadURL,
				        postType: "photo",

                                })
                                .then(() => {
                                    console.log('Photo URL added to family tree document.');
    document.getElementById('postPic_img').src = "/wefamily/images/imgPlacehoder2.png";

                                })
                                .catch((error) => {
                                    console.error('Error adding photo URL to family tree document:', error);
                                });

			     })

	
			    
				}
		
        })
        .catch((error) => {
            console.error("Error adding news post:", error);
        });
	   
	      
	      }

	    
    let newsPostingEnabled = true;

        // Function to toggle the boolean flag
        function toggleNewsPosting() {
            newsPostingEnabled = !newsPostingEnabled;
            const buttonText = newsPostingEnabled ? 'Disable News Posting' : 'Enable News Posting';
            document.getElementById('toggleNewsButton').textContent = buttonText;
        }

        // Attach a click event listener to the button
        document.getElementById('toggleNewsButton').addEventListener('click', toggleNewsPosting);




function newsPost(xxx) {
    if (!xxx) {
        return;
    }
        if (!newsPostingEnabled) {
                console.log("News posting is currently disabled.");
                return;
            }
	
    const post = {
        postID: "", // Leave it empty for now
        postType: "news",
        pinned: "",
        treeID: currentFamilyID,
        userID: "",
        content: xxx,
        photo: "",
        memberPhoto: "",
        author: "Family Ties Update",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    firestore
        .collection("posts")
        .add(post)
        .then((docRef) => {
            console.log("News post added successfully with ID:", docRef.id);

            // Update the postID field with the generated document ID
            const update = { postID: docRef.id };
            firestore.collection("posts").doc(docRef.id).update(update);
        })
        .catch((error) => {
            console.error("Error adding news post:", error);
        });
}



        function limitPostContent() {
    const textarea = document.getElementById('post-content');
    const content = textarea.value;

    // Limit the post to 500 characters
    const truncatedContent = content.slice(0, 500);
    textarea.value = truncatedContent;
}

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('post-content');
    textarea.addEventListener('input', limitPostContent);
});


