
/// works

let nodeGroup;


// Add a zoom control UI
const zoomControls = document.getElementById('zoom-controls');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');

// Define zoom behavior and initial scale
const initialScale = 1;
let currentScale = initialScale;

let imageWidth = 100;
let imageHeight = 100;

zoomOutButton.addEventListener('click', () => {
  if (currentScale > 2) {
    return;
  }		    console.log("+ newScale   " + currentScale);

  const newScale = currentScale * 1.2; // Increase scale by 20%
  applyZoom(newScale);
});

zoomInButton.addEventListener('click', () => {
  if (currentScale < 0.5) {
    return;
  }		    console.log("- newScale   " + currentScale);

  const newScale = currentScale / 1.2; // Decrease scale by 20%
  applyZoom(newScale);
});

    // Create a group element to hold the links
       var chartGroup; 
 var linkGenerator;
function generateFamilyTreeChart(familyData) {
	

let width = 800;// window.screen.width;
    const height = 1500 ;//*  maxHierarchyDepth; // Height of the chart
document.getElementById('family-tree-area').innerHTML ="";
    // Create an SVG element to contain the chart
    const svgMain = d3.select("#family-tree-area")
        .append("svgMain")
        .attr("width", width)
        .attr("height", height);

//width = window.screen.width;
	
    const svg = d3.select("#family-tree-area")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


     const height_Layout = 150 * maxHierarchyDepth;
    // Create a hierarchical tree layout
    const treeLayout = d3.tree().size([width, height_Layout]);
    
chartGroup  = svg.append("g");
	
	    console.log("maxHierarchyDepth   " + maxHierarchyDepth);
	    console.log("familyData   " + familyData);




    
// Create a root node for the tree with an initial y-coordinate of 50
const root = d3.hierarchy(familyData).eachBefore(d => {
 //   d.y = d.depth * 100 + 50; // Adjust the '100' for your desired vertical spacing
    d.y = d.depth *  50; // Adjust the '100' for your desired vertical spacing
});



    // Assign coordinates to each node in the tree
    treeLayout(root);

// Create a link generator with zoom transformation
     linkGenerator = d3.linkHorizontal()
        .x(d => d.x) // Swap x and y due to vertical tree layout
        .y(d => d.y);

    // Initialize zoom with the initial scale
    const zoom = d3.zoom()
        .scaleExtent([0.5, 5]) // Define the zoom scale limits
        .on("zoom", zoomed);

    // Create links between parent and child nodes
    const links = root.links();

// Draw custom links between nodes
// Define a function to generate curved paths
const curvedPath = (d) => {
    const sourceX = d.source.x;
    const sourceY = d.source.y;
    const targetX = d.target.x;
    const targetY = d.target.y;

    // Calculate control point coordinates for a curved link
    const controlX = (sourceX + targetX) / 2;
    const controlY = (sourceY + targetY) / 2;

    return `M${sourceX},${sourceY} Q${controlX},${controlY} ${targetX},${targetY}`;
};

// Append curved links
chartGroup.selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", curvedPath) // Use the curvedPath function
    .style("fill", "none")
    .style("stroke", "gray")
    .style("stroke-width", 2);


    



let memberData = root.descendants().children;
	    console.log('memberData: '+ memberData);
	    //console.log('memberData.lenght: '+ memberData.length);

if (memberData === "undefined") {
    // Add text labels to nodes
    chartGroup.selectAll("text")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", 60) // Adjust the vertical position of labels
        .attr("text-anchor", "middle")
        .text(d => d.data.name) // Display member names
    .on("click", function (event, d) {
        // 'd' contains the data associated with the clicked link
        console.log("Clicked text Data:", d.data);
        // You can now use d.data to access relationship information
	    // Example usage
showMemberPopup(d.data);


    });
                    }else{
    // Add text labels to nodes
    chartGroup.selectAll("text")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", -60) // Adjust the vertical position of labels
        .attr("text-anchor", "middle")
        .text(d => d.data.name) // Display member names
    .on("click", function (event, d) {
        // 'd' contains the data associated with the clicked link
        console.log("Clicked text Data:", d.data);
showMemberPopup(d.data);

    });

	  }



 nodeGroup = chartGroup.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`) // Set group position



	/*
nodeGroup.append("circle")
    .attr("class", "circle")
    .attr("r", 20) // Radius of circles
    .attr("clip-path", "url(#clipCircle)")  // Apply the circular clip path
    .on("click", function (event, d) {
        // 'd' contains the data associated with the clicked node
        console.log("Clicked circle Data:", d.data);
    });
*/


	
// Update the clipPath to create a circular clip
nodeGroup.append("defs").append("clipPath")
    .attr("id", "clipCircle")
    .append("circle")
    .attr("cx", 0)  // Center X at 0
    .attr("cy", 0)  // Center Y at 0
    .attr("r", imageWidth / 2);  // Radius of the circle, half of the image width

// Update the image elements to use the circular clip path
nodeGroup.append("circle")
    .attr("class", "circle")
    .attr("r", imageWidth / 2) // Radius of circles, half of the image width
    .attr("clip-path", "url(#clipCircle)")  // Apply the circular clip path
    .style("stroke", "black")  // Border color
    .style("stroke-width", "1px")  // Border width

nodeGroup.append("image")
    .attr("xlink:href", d => d.data.photo)
    .attr("x", d => -imageWidth / 2)
    .attr("y", d => -imageHeight / 2)
    .attr("width", imageWidth)
    .attr("height", imageHeight)
    .attr("clip-path", "url(#clipCircle)")
    .style("object-fit", "cover")  // Apply object-fit: cover
    .on("click", function (event, d) {
        console.log("Clicked image Data:", d.data);
        showMemberPopup(d.data);
    });











    // Apply the zoom behavior to the SVG
    svg.call(zoom)
        .call(zoom.transform, d3.zoomIdentity.scale(initialScale)); // Apply initial scale
const translateX = 0;
const translateY = 100;
const scale = 1;    
    // Set the transform attribute
chartGroup.attr("transform", `translate(${translateX},${translateY}) scale(${scale})`);
    
// Define the zoom function
function zoomed(event) {
  // Apply the zoom transformation to the chartGroup
  chartGroup.attr('transform', event.transform);


	  updateImageAttributes();

  // Apply the same zoom transformation to the link lines
  chartGroup
    .selectAll('path.link')
    .attr('d', (d) => {
      // Generate the updated path data using the link generator
      const source = { x: d.source.x * currentScale, y: d.source.y * currentScale };
      const target = { x: d.target.x * currentScale, y: d.target.y * currentScale };
      return linkGenerator({ source, target });
    });
}

	
}

function updateImageAttributes() {
  nodeGroup.selectAll("image")
    .attr("x", d => -imageWidth / (2 * currentScale)) // Adjust positioning based on scale
    .attr("y", d => -imageHeight / (2 * currentScale))
    .attr("width", imageWidth / currentScale)
    .attr("height", imageHeight / currentScale);
}


// Create the zoom function
function applyZoom(scale) {
  currentScale = scale;

  if (!chartGroup) {
    console.error('chartGroup is not defined. Ensure that it is properly initialized.');
    return;
  }

  // Update circle radius, text font size, image dimensions, stroke width
  chartGroup.selectAll('circle').attr('r', 20 / scale);
  chartGroup.selectAll('text').attr('font-size', 14 / scale);
  chartGroup
    .selectAll('image')
    .attr('y', (d) => d.y) // Adjust the positioning
    .attr('width', 100 / scale)
    .attr('height', 100 / scale);
  chartGroup.selectAll('path.link').attr('stroke-width', 2 / scale);

  // Update path 'd' attribute
  chartGroup
    .selectAll('path.link')
    .attr('d', (d) => {
      const source = { x: d.source.x, y: d.source.y * scale };
      const target = { x: d.target.x, y: d.target.y * scale };
      return linkGenerator({ source, target });
    });

	  updateImageAttributes();

}



         function populateMemberInfo(member) {
    // Populate image and text
    document.getElementById('memberImage').src = member.photo;
    document.getElementById('memberInfo').value = member.location;
    document.getElementById('memberName').textContent = `${member.name} `;
      
    // Populate member details
    const memberDetails = {
        'Member ID': member.id,
        'Member Name': `${member.name}`,
        'Location': member.location,
        'Birthdate': member.birthdate,
        'Deceased Date': member.deceaseddate,
        'Contact': member.contact,
        'Note': member.note,
        'Children': member.children.join(', '),
        'Spouse': member.spouse.join(', '),
        'Parents': member.parents.join(', '),
        'Siblings': member.siblings.join(', ')
    };

    const detailsList = document.getElementById('memberDetails');
    detailsList.innerHTML = ''; // Clear previous content

    for (const [key, value] of Object.entries(memberDetails)) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${key}:</strong> ${value}`;
        detailsList.appendChild(listItem);
    }
}

function showMemberPopup(member) {
		    console.log("member   " + member.id);
const scrollTo = document.getElementById('scrollTo');

scrollTo.addEventListener('click', () => {
	

    const memberDiv = document.getElementById(member.id);
    
    if (memberDiv) {
        // Scroll to the member's div
        memberDiv.scrollIntoView({ behavior: 'smooth' });

        // Get the height of the viewport
        const viewportHeight = window.innerHeight;

        // Get the top position of the div
        const divTop = memberDiv.getBoundingClientRect().top;

        // Calculate the scroll position to center the div
        const scrollPosition = divTop - (viewportHeight / 2);

        // Scroll to center the div
        window.scrollBy({
            top: scrollPosition,
            behavior: 'smooth'
        });

}else{
document.getElementById(member.id).scrollIntoView({ behavior: 'smooth' });


}



  console.log('Div clicked!');
	hideMemberPopup();
});
	
    populateMemberInfo(member);
    const popup = document.getElementById('memberDetailPopup');
    popup.style.display = 'block';
}


function hideMemberPopup() {

    const popup = document.getElementById('memberDetailPopup');
    popup.style.display = 'none';
}





const exportButton = document.getElementById('export-button');
exportButton.addEventListener('click', () => {
    // Select the SVG element containing your family tree
    const svgElement = document.querySelector('#family-tree-area svg');

    // Use html2canvas to capture the SVG as an image
    html2canvas(svgElement).then(canvas => {
        // Create a download link for the image
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'family-tree.png'; // Set the desired filename
        link.click();
    });
});


function setRootValue(rootValue) {
    const db = firebase.firestore();
			                    console.log(' rootValue.'+rootValue);
    // Reference to the document in the collection
    const docRef = db.collection("familyTrees").doc(treeData.treeID);

    // Update the document with the new root value
    return docRef.update({ root: rootValue })
        .then(() => {
            console.log(`Root value updated successfully for document with ID:`);
        })
        .catch((error) => {
            console.error(`Error updating root value: ${error}`);
        });
}



let maxHierarchyDepth = 0;
let memberIDWithMaxDepth = null;

const memberDataMap = {};
let rootID = "";

function fetchFamilyMemberData(collectionName, treeID) {
    return new Promise((resolve, reject) => {
        const db = firebase.firestore();
	    
    /*
    console.log("treeID   " + treeID);
    console.log("treeData.name   " + treeData.name);
   */
        const query = db.collection(collectionName).where('familyID', 'array-contains', treeID);

        query.get()
            .then((querySnapshot) => {
                const querySnapshotCount = querySnapshot.size;

 

                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    const id = doc.id;
                    const memberID = doc.memberID;
                    const private = doc.private;
                    const location = doc.location;
                    const birthdate = doc.birthdate;
                    const deceaseddate = doc.deceaseddate;
                    const contact = doc.contact;
                    const note = doc.note;
                    const name = `${docData.first_name} ${docData.last_name}`;
                    const photo = docData.photo || '';
                    const children = docData.children || [];
                    const spouse = docData.spouse || [];
                    const parents = docData.parents || [];
                    const siblings = docData.sibling || [];

                    // Check if the member is not already in memberDataMap and map them
                    if (!memberDataMap[id]) {
                        const memberData = {
                            id: id,
                            memberID: memberID,
                            name: name,
                            private: private,
                            location: location,
                            birthdate: birthdate,
                            deceaseddate: deceaseddate,
                            contact: contact,
                            note: note,
                            photo: photo,
                            children: children,
                            spouse: spouse,
                            parents: parents,
                            siblings: siblings,
                        };

                        // Store member data in the map
                        memberDataMap[id] = memberData;
                    }
       rootID = id;
                    // Check and update parent and sibling relationships
                    parents.forEach((parentsID) => {
                        if (memberDataMap[parentsID]) {
                            // Update childNode's parent
                            memberDataMap[parentsID].children.push(id);
                            // Update current member's child
                            memberDataMap[id].parents.push(parentsID);
                        }
                    });

    });


   let maxChildrenCount = 0;

        Object.values(memberDataMap).forEach((member) => {
          if (member.children.length > maxChildrenCount) {
            maxChildrenCount = member.children.length;
            memberIDWithMaxDepth = member.id;
          }
        });

        // Update the root to use the member with the most children as the root
        let root = {
          id: treeID,
          name: treeData.name,
          children: [], // Set the member with the most children as the root
          data: treeData,
        };
    console.log("treeID   " + treeID);
    console.log("maxChildrenCount   " + maxChildrenCount);
    console.log("memberIDWithMaxDepth   " + memberIDWithMaxDepth);
    console.log("treeData.name   " + treeData.name);
    console.log("treeData.children   " + treeData.children);


 if(maxChildrenCount > 0){
			  
		  root = {
          id: treeID,
          name: treeData.name,
          children: [memberIDWithMaxDepth], // Set the member with the most children as the root
          data: memberDataMap,
        }; 
    console.log("maxChildrenCount root   " + root);
console.log('memberDataMap:', memberDataMap);
	 setRootValue(memberIDWithMaxDepth);

		  }else if (treeData.root ) {
 root = {
          id: treeID,
          name: treeData.name,
          children: [treeData.root], // Set the member with the most children as the root
          data: treeData,
        };
		    console.log("treeData root   " + root);
	  
                    } else {
                      root = {
          id: treeID,
          name: treeData.name,
          children: [rootID], // Set the member with the most children as the root
          data: memberDataMap,
        };    
	 		    console.log("else root   " + root);

                    }	

// Call buildTree to populate memberDataMap and calculate hierarchy depth
const hierarchicalTree = buildTree(root, querySnapshotCount, new Set(), 0, 0);

console.log('Member ID with the greatest HierarchyDepth:', memberIDWithMaxDepth);
console.log('Maximum HierarchyDepth:', maxHierarchyDepth);



		    
  resolve(hierarchicalTree);



            })
            .catch((error) => {
                reject(error);
            });
    });
}

function buildTree(node, depthLimit, processedNodes, currentDepth) {
    const uniqueChildren = {}; // Declare uniqueChildren as an empty object

  const childResults = node.children
    .map((childID) => {
      const childNode = memberDataMap[childID];
      if (childNode) {
        if (!uniqueChildren[childID]) {
          return buildTree(childNode, depthLimit - 1, processedNodes, currentDepth + 1);
        }
      }
      return null;
    })
    .filter((result) => result !== null);  // Remove null results

  if (childResults.length === 0) {
    maxHierarchyDepth = currentDepth;
  } else {
    maxHierarchyDepth = Math.max(...childResults.map((result) => result.maxDepth));
  }

  node.children = childResults.map((result) => result.node);

  return { node, maxDepth: maxHierarchyDepth };
}


function resetFamilyTree() {
    // Clear the family tree area
    const familyTreeArea = document.getElementById('family-tree-area');
    familyTreeArea.innerHTML = '';

    // Reset variables
    let maxHierarchyDepth = 0;
    let memberIDWithMaxDepth = null;
    const memberDataMap = {};
    let rootID = '';

    // Load the family tree chart again
    loadFamilyTreeChart();
}


function loadFamilyTreeChart(treeData) {

    fetchFamilyMemberData('familyMembers', currentFamilyID, treeData)
        .then((hierarchicalTree) => {
            console.log("Hierarchical tree data:", hierarchicalTree); // Log the data

		let data = hierarchicalTree.node;

		
		 console.log("Hierarchical data:", data); 
            generateFamilyTreeChart(data);
            console.log("Family tree chart generated."); // Log when the chart is generated

		        })
        .catch((error) => {
            console.error('Error fetching family member data:', error);
        });
}
