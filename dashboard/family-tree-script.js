
/// works



/// works

// Add a zoom control UI
const zoomControls = document.getElementById('zoom-controls');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');


zoomOutButton.addEventListener('click', () => {
            console.log('zoom.transform :', zoom.transform);
	    const width = window.screen.width;
       console.log('width :', width);
       console.log('zoom :', zoom);
       console.log('d3.zoomIdentity :', d3.zoomIdentity);


	
});

zoomInButton.addEventListener('click', () => {

	
});

    // Create a group element to hold the links
var chartGroup; 
var linkGenerator;
var zoom ;
// Define zoom behavior and initial scale
const initialScale = 1;
let currentScale = initialScale;

let imageWidth = 100;
let imageHeight = 100;
var nodeGroup;
	
function generateFamilyTreeChart(familyData) {
    const width = 300 * maxGenerationWidth; //window.screen.width;
    const height_Layout = 200 * maxHierarchyDepth // + 250;
const browserWidth = window.innerWidth;   // Width of the browser window in pixels

	            console.log('width :', width);
	            console.log('height_Layout :', height_Layout);

    document.getElementById('family-tree-area').innerHTML = "";
    
    // Create an SVG element to contain the chart
    const svgMain = d3.select("#family-tree-area")
        .append("svg")
        .attr("width", width)
        .attr("height", height_Layout);

    const svg = d3.select("#family-tree-area").append("svg")
        .attr("width", width)
        .attr("height", height_Layout);

    // Create a hierarchical tree layout
    const treeLayout = d3.tree().size([width, height_Layout]);

    chartGroup = svg.append("g").style("transform-origin", "center top");



 

   // Generate the tree layout using the modified size
const root = d3.hierarchy(familyData).eachBefore(d => {
    d.y = d.depth * width + 70; // Adjust the width between nodes as needed
    d.x = d.depth * 100; // Adjust the vertical spacing as needed
})

    treeLayout(root);
	
     linkGenerator = d3.linkHorizontal()
        .x(d => d.x) // Swap x and y due to vertical tree layout
        .y(d => d.y);

    const links = root.links();


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



    zoom = d3.zoom()
        .scaleExtent([0.1, 10]) // Define the zoom scale limits
        .on("zoom", zoomed);
	
	
chartGroup.selectAll("path")
  .data(links)
  .enter()
  .append("path")
  .attr("class", "link")
  .attr("d", curvedPath)  // Use the curved path generator function
  .style("fill", "none")
  .style("stroke", "gray")
  .style("stroke-width", 2);





	


	




/*
	
	// Adjust the position of the text elements
nodeGroup.selectAll("text")
    .attr("x", d => d.x)  // Adjust the x position as needed
    .attr("y", d => d.y - 20);  // Adjust the y position as needed

*/


    let memberData = familyData;
console.log('memberData data:', memberData.data);
memberData = memberData.data;
//let memberDataX = memberData();
 	//console.log('memberDataX :', memberDataX);



console.log('userID :', userID);
console.log('memberData.id :', memberData.id);


  
	
    if (memberData.id === userID) {
console.log('?????????????????????????????????????????????????????????????????????????      userID :');
    }
              console.log('memberData.children :', memberData.children);




	// Add text for each node
chartGroup.selectAll("text")
    .data(root.descendants())
    .enter()
    .append("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("dy", 70)
    .attr("text-anchor", "middle")
    .style("font-weight", "900")  // Set font weight to bold
    .style("font-size", "1.2em")     // Set font size to 1em
    .style("fill", "white")        // Set font color to white
    .style("pointer-events", "none")  // Prevent text from blocking click events
    .text(d => d.data.name)
    .on("click", function (event, d) {
        console.log("Clicked text Data:", d.data);
        showMemberPopup(d.data);
    })
    .each(function () {
        const bbox = this.getBBox();
        d3.select(this.parentNode)
            .insert("rect", ":first-child")
            .attr("x", bbox.x - 5)
            .attr("y", bbox.y - 2)
            .attr("width", bbox.width + 10)
            .attr("height", bbox.height + 4)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "black")
            .style("opacity", 1);  // Adjust the opacity as needed
    });







nodeGroup = chartGroup.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`);




	
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
.style("height", 'auto')
    .style("stroke", "black")  // Border color
    .style("stroke-width", "20px");  // Border width

nodeGroup.append("image")
    .attr("xlink:href", d => d.data.photo)
    .attr("x", d => -imageWidth / 2)
    .attr("y", d => -imageHeight / 2)
    .attr("width", imageWidth)
    .attr("height", imageHeight)
    .attr("clip-path", "url(#clipCircle)")
    .style("object-fit", "cover" )
.style("width", imageWidth)
.style("height", 'auto')
	.on("click", function (event, d) {
        console.log("Clicked image Data:", d.data);
        showMemberPopup(d.data);
    });



// After appending the images to nodeGroup
const nodes = root.descendants();
handleCollisions(nodes);













  

    // Apply the zoom behavior to the SVG
    svg.call(zoom)
        .call(zoom.transform, d3.zoomIdentity.scale(initialScale)); // Apply initial scale


console.log('Browser width:', browserWidth);
	
const translateX = (browserWidth - width) / 2;
const translateY = 250;
 const scale =  browserWidth / width;
	let newScale = (scale * 10);
// Calculate the middle position within the browser view width
const middle = (browserWidth - width ) / (scale * 10);
		//currentScale = newScale;

	
// Set the transform attribute
chartGroup.attr("transform", `translate(${middle},${translateY}) scale(${scale})`);

/*
	            console.log('newScale :', newScale);
	            console.log('middle :', middle);
            console.log('width :', width);

            console.log('translateX :', translateX);
            console.log('scale :', scale);

*/
	
function zoomed(event) {
	/*
  if (event.transform.k === currentScale) {
    console.log('No zoom change');
    return;
  } else {
  //  currentScale = event.transform.k;

	      console.log(`currentScale of ${currentScale}:`);
  }
*/
  chartGroup.attr('transform', event.transform);

  updateImageAttributes();

chartGroup
    .selectAll('path.link')
    .attr('d', (d) => {
      // Generate the updated path data using the link generator
      const source = { x: d.source.x * currentScale, y: d.source.y * currentScale };
      const target = { x: d.target.x * currentScale, y: d.target.y * currentScale };
      return linkGenerator({ source, target });
    });
}

	/*
    zoom = d3.zoom()
        .scaleExtent([0.1, 10]) // Define the zoom scale limits
        .on("zoom", zoomed);
*/

	// updateImageAttributes();

}


	

function updateImageAttributes() {
  nodeGroup.selectAll("text")
        .attr("x", d => d.x)  // Adjust the x position as needed
        .attr("y", d => d.y - 20);  // Adjust the y position as needed

  nodeGroup.selectAll("image")
    .attr("x", d => -imageWidth / (2 * currentScale)) // Adjust positioning based on scale
    .attr("y", d => -imageHeight / (2 * currentScale))
    .attr("width", imageWidth / currentScale)
    .attr("height", imageHeight / currentScale);
}

// Collision detection to prevent overlapping
function handleCollisions(nodes) {
  const padding = 10; // Adjust padding based on your preference

  const quadtree = d3.quadtree()
    .x(d => d.x)
    .y(d => d.y)
    .addAll(nodes);

  nodes.forEach(node => {
    const radius = imageWidth / (2 * currentScale); // Assuming images are circular
    const x = node.x;
    const y = node.y;

    quadtree.visit(visitedNode => {
      const isCollision = visitedNode !== null && visitedNode !== node &&
        Math.abs(x - visitedNode.x) < radius + padding &&
        Math.abs(y - visitedNode.y) < radius + padding;

      if (isCollision) {
        const xDirection = x < visitedNode.x ? -1 : 1;
        const yDirection = y < visitedNode.y ? -1 : 1;

        const xAdjust = (radius + padding) * xDirection;
        const yAdjust = (radius + padding) * yDirection;

        node.x += xAdjust;
        node.y += yAdjust;
      }

      return isCollision;
    });
  });
}

// Create the zoom function

function applyZoom(scale) {
  currentScale = scale;
	       console.log('applyZoom(scale)  :');

  if (!chartGroup) {
    console.error('chartGroup is not defined. Ensure that it is properly initialized.');
    return;
  }

  // Update circle radius, text font size, image dimensions, stroke width
  chartGroup.selectAll('.circle').attr('r', imageWidth / (2 * currentScale));
  chartGroup.selectAll('text').attr('font-size', "1.2em" / currentScale);
  chartGroup
    .selectAll('image')
    .attr('x', d => -imageWidth / (2 * currentScale))
    .attr('y', d => -imageHeight / (2 * currentScale))
    .attr('width', imageWidth / currentScale)
    .attr('height', imageHeight / currentScale);
  chartGroup.selectAll('path.link').attr('stroke-width', 2 / currentScale);

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
    document.getElementById('memberName').textContent = `${member.name} `;
          document.getElementById('memberInfo').value = member.bio || "";


const memberID = member.id;
 const memberData = memberDataMap[memberID];

let formattedBirthdate = formatDateToMonthDay(member.birthdate);
const memberDetails = {
    'Name': `${member.name}`,
    'Location': member.location,
    'Birthdate': formattedBirthdate,
    'Contact': member.contact,
    'Note': member.note,
};
if (member.deceaseddate) {
    memberDetails['Deceased Date'] = member.deceaseddate;
}

let children = displayChildrenNames(memberID, displayChildrenCallback);

  //  console.log('children Names:', children);
		 
	 let parentNames = getParentNames(memberID);
	 
  //  console.log('parentNames Names:', parentNames);
		 

		 

if (Array.isArray(parentNames)) {
  // Initialize an array to store parent names
  memberDetails['Parent: '] = [];
  parentNames.forEach((parent, index) => {
    // Push each parent's name to the array
    memberDetails['Parent: '].push(parent.name || '');
  });
}

// Other properties can be added similarly based on your logic
if (Array.isArray(children)) {
  let childrenList = '';

  children.forEach((child, index) => {
    childrenList += '<br>' + child.name + '<br>' || '';
  });

  // Assign the children list to memberDetails
  memberDetails['Children: '] = childrenList;
}

	
  
       // 'Children': member.children.join(', '),

    const detailsList = document.getElementById('memberDetails');
    detailsList.innerHTML = ''; // Clear previous content

    for (const [key, value] of Object.entries(memberDetails)) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${key}:</strong> ${value}`;
        detailsList.appendChild(listItem);
    }
}

function showMemberPopup(member) {

const scrollTo = document.getElementById('scrollTo');

scrollTo.addEventListener('click', () => {
	
document.getElementById(member.id).scrollIntoView({ behavior: 'smooth' });

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
    const svgElement = document.querySelector('transform g'); /// family-tree-area

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
const memberID = docData.memberID || '';
const bio = docData.bio || '';
const userID = docData.userID || '';
const privateInfo = docData.private || '';
const location = docData.location || '';
const birthdate = docData.birthdate || '';
const deceaseddate = docData.deceaseddate || '';
const contact = docData.contact || '';
const first_name = docData.first_name || '';
const middle_name = docData.middle_name || '';
const last_name = docData.last_name || '';
const nameSuffix = docData.nameSuffix || '';
const note = docData.note || '';

const name = `${first_name} ${last_name} ${nameSuffix}`;

		      
                    const photo = docData.photo || "/wefamily/images/memberPlaceholder.jpg" ;
                    const children = docData.children || [];
                    const spouse = docData.spouse || [];
                    const parents = docData.parents || [];
                    const siblings = docData.sibling || [];


                    // Check if the member is not already in memberDataMap and map them
                    if (!memberDataMap[id]) {
                        const memberData = {
                            id: id,
                            userID: userID,
                            memberID: memberID,
                            name: name,
                            middle_name: middle_name,
                            private: privateInfo,
                            location: location,
                            birthdate: birthdate,
                            deceaseddate: deceaseddate,
                            contact: contact,
                            bio: bio,
                            note: note,
                            photo: photo,
                            children: children,
                            spouse: spouse,
                            parents: parents,
                            siblings: siblings,
    depth: 0, // Initialize depth to 0 for each member

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

 if (parents.length > 0) {
    memberData.depth = Math.max(...parents.map(parentID => memberDataMap[parentID].depth)) + 1;
  }


		      

    });


   let maxChildrenCount = 0;

        Object.values(memberDataMap).forEach((member) => {
          if (member.children.length > maxChildrenCount) {
            maxChildrenCount = member.children.length;
            memberIDWithMaxDepth = member.id;
          }
        });

const parentsOfParents = getParentsOfParents(memberIDWithMaxDepth);

// Log the parents of parents
console.log('Parents of Parents:', parentsOfParents);
		    
        // Update the root to use the member with the most children as the root
        let root = {
  id: treeID,
  name: treeData.name,
  children: maxChildrenCount > 0 ? [memberIDWithMaxDepth] : [treeData.root || rootID],
  data: maxChildrenCount > 0 ? memberDataMap : treeData,
          photo: treeData.photo,
          location: treeData.location,
          description: treeData.description,
          public: treeData.public,
          adminID: treeData.adminID,
          familyCode: treeData.familyCode,
        };
    console.log("treeID   " + treeID);
    console.log("maxChildrenCount   " + maxChildrenCount);
    console.log("memberIDWithMaxDepth   " + memberIDWithMaxDepth);
    console.log("treeData.name   " + treeData.name);

		    
const nodeID = memberIDWithMaxDepth; // Replace with the actual node ID
const depthCounts = {}; // Object to store counts at each depth
countChildrenAtEachDepth(nodeID, 0, depthCounts);

console.log('Children count at each depth:', depthCounts);






		    

let maxCount = 0;
let maxDepth = 0;

for (const depth in depthCounts) {
  const count = depthCounts[depth];
  if (count > maxCount) {
    maxCount = count;
    maxDepth = parseInt(depth); // Convert depth to a number
  }
}

//console.log('Highest count of children:', maxCount);
//console.log('Corresponding depth:', maxDepth);
		    maxGenerationWidth = maxCount;
		    
// Call buildTree to populate memberDataMap and calculate hierarchy depth
const hierarchicalTree = buildTree(root, querySnapshotCount, new Set(), 0, 0);


		    
  resolve(hierarchicalTree);



            })
            .catch((error) => {
                reject(error);
            });
    });
}

function buildTree(node, depthLimit, processedNodes, currentDepth) {
    const uniqueChildren = {}; // Declare uniqueChildren as an empty object


  const childResults = node.children.map((childID) => {
    const childNode = memberDataMap[childID];
    if (childNode) {
      // Update the child node's depth
      childNode.depth = currentDepth + 1;
      return buildTree(childNode, depthLimit - 1, processedNodes, currentDepth + 1);
    }
    return null;
  }).filter((result) => result !== null);

  // Update the maxHierarchyDepth for this depth
  if (childResults.length === 0) {
    maxHierarchyDepth = currentDepth;
  } else {
    maxHierarchyDepth = Math.max(...childResults.map((result) => result.maxDepth));
	document.getElementById('familyDepth').innerHTML =  maxHierarchyDepth + "Generations"; 
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




function displayChildrenNames(parentID, callback) {
    const parent = memberDataMap[parentID];
             
    if (!parent) {
        console.log(`Parent with ID ${parentID} not found.`);
        return;
    }

    const childrenData = parent.children;

    if (childrenData.length === 0) {
        console.log(`Parent ${parent.name} has no children.`);
        return;
    }

    // Extract names and ids for each child
    const childrenNames = childrenData.map((child) => ({
        id: child.id || '',
        name: child.name || '',
    }));
  //      console.log(`parent.name, childrenNames ${parent.name, childrenNames} `);

    //callback(parent.name, childrenNames);

	return childrenNames;
}




// Example callback function to display children names
function displayChildrenCallback(parentName, childrenNames) {
   // console.log(`Children of ${parentName}:`);
	let children = "";
    childrenNames.forEach((child) => {
//        console.log(`- ${child.name} (ID: ${child.id})`);
	    children = children + child.name+", ";
    });
	return children;
}








function getParentNames(childID) {
  let parentName = null;
	                console.log(`childID ${childID}  found.`);

  // Iterate through each member in the map
  for (const [memberID, member] of Object.entries(memberDataMap)) {
    const children = member.children;

    // Check if the childID exists in the member's children
    if (children && children.includes(childID)) {
      parentName = member.name;
	                console.log(`parentName ${parentName}  found.`);

      // Break the loop as we found the parent
      break;
    }
  }




  return parentName;
    }
    
  


function countChildrenAtEachDepth(nodeID, currentDepth, depthCounts) {
  const node = memberDataMap[nodeID];
  if (!node) return;  // Node not found or invalid ID

  // Increment the count for the current depth
  if (!depthCounts[currentDepth]) {
    depthCounts[currentDepth] = 1;
  } else {
    depthCounts[currentDepth]++;
  }

  // Recur for each child with increased depth
  node.children.forEach((childID) => {
    countChildrenAtEachDepth(childID, currentDepth + 1, depthCounts);
  });
}

function getParentsOfParents(nodeID) {
  const parentsOfParents = []; // Array to store parents of parents

  const getNodeParents = (nodeID) => {
    const node = memberDataMap[nodeID];
    if (!node) return; // Node not found

    const parentIDs = node.parents;

    // Traverse each parent and gather their parents
    for (const parentID of parentIDs) {
      const parentNode = memberDataMap[parentID];
      if (parentNode) {
        parentsOfParents.push(parentNode);
        // Recursively get parents of this parent
        getNodeParents(parentID);
      }
    }
  };

  getNodeParents(nodeID);
  return parentsOfParents;
}



function loadFamilyTreeChart(treeData) {

    fetchFamilyMemberData('familyMembers', currentFamilyID, treeData)
        .then((hierarchicalTree) => {
         //   console.log("Hierarchical tree data:", hierarchicalTree); // Log the data

		let data = hierarchicalTree.node;

		
		 console.log("Hierarchical data:", data); 
            generateFamilyTreeChart(data);
            console.log("Family tree chart generated."); // Log when the chart is generated

		        })
        .catch((error) => {
            console.error('Error fetching family member data:', error);
        });
}
