
/// works
function centerElementInSVG(element, svg) {
  const svgWidth = parseInt(svg.attr("width"));
  const svgHeight = parseInt(svg.attr("height"));

  if (!isNaN(svgWidth) && !isNaN(svgHeight)) {
    const elementWidth = element.node().getBBox().width;
    const elementHeight = element.node().getBBox().height;

    const translateX = (svgWidth - elementWidth) / 2;
    const translateY = (svgHeight - elementHeight) / 2;

    if (!isNaN(translateX) && !isNaN(translateY)) {
      element.attr("transform", `translate(${translateX},${translateY})`);
    }
  }
}
// Usage example for centering nodeGroup
//centerElementInSVG(nodeGroup);


function centerLayersOnScreen() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Get the dimensions of the layers
  const nodeGroupWidth = nodeGroup.node().getBBox().width;
  const nodeGroupHeight = nodeGroup.node().getBBox().height;

  const chartGroupWidth = chartGroup.node().getBBox().width;
  const chartGroupHeight = chartGroup.node().getBBox().height;

  // Calculate the translation for nodeGroup to center horizontally
  const nodeGroupTranslateX = (screenWidth - nodeGroupWidth) / 2;
  const nodeGroupTranslateY = (screenHeight - nodeGroupHeight) / 2;

  // Calculate the translation for chartGroup to center horizontally
  const chartGroupTranslateX = (screenWidth - chartGroupWidth) / 2;
  const chartGroupTranslateY = (screenHeight - chartGroupHeight) / 2;

	updateImageAttributes();
console.log('XXXX nodeGroup width:', nodeGroupWidth, 'height:', nodeGroupHeight);

  // Apply the translation to center the layers
  nodeGroup.attr('transform', `translate(${nodeGroupTranslateX},${nodeGroupTranslateY})`);
  chartGroup.attr('transform', `translate(${chartGroupTranslateX},${chartGroupTranslateY})`);
}

// Call this function to center the layers

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


	closeFullscreen();


	
});

zoomInButton.addEventListener('click', () => {
//centerLayersOnScreen();
centerElementInSVG(chartGroup, d3.select("#family-tree-area"));
centerElementInSVG(nodeGroup, d3.select("#family-tree-area"));
	
console.log('chartGroup width:   ', chartGroup);

console.log('nodeGroup width:   ', nodeGroup);
});

const familyTree = document.getElementById('family-tree');


familyTree.addEventListener('click', () => {

toggleFullscreen();
	
});

function toggleFullscreen() {
  var expandableDiv = document.getElementById("family-tree");
  expandableDiv.classList.toggle("show");
}

function closeFullscreen() {
  var expandableDiv = document.getElementById("family-tree");
  expandableDiv.classList.remove("show");
}



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
   var bbox;
var nodes;

function generateFamilyTreeChart(familyData) {
const chartWidth = 300 * maxGenerationWidth;
const chartHeight = 150 * maxHierarchyDepth;

const browserWidth = window.innerWidth;
const width = window.screen.width;

const scale = browserWidth / chartWidth;
let currentScale = scale;
 document.getElementById('family-tree').innerHTML += "  browserWidth  "+browserWidth;

	
const translation = (width - chartWidth * scale) / 2;
console.log('Translation:', translation);
       console.log('maxHierarchyDepth :', maxHierarchyDepth);
console.log('chartHeight:', chartHeight);

console.log('chartWidth:', chartWidth);
console.log('browserWidth:', browserWidth);
console.log('width:', width);
console.log('currentScale:', currentScale);

document.getElementById('family-tree-area').innerHTML = "";
// document.getElementById("family-tree").style.height = chartHeight +"px";

const svg = d3.select("#family-tree-area").append("svg")
  .attr("width", chartWidth)
  .attr("height", chartHeight);

let middle;
 document.getElementById('family-tree-area').style.width = chartWidth +"px";
 document.getElementById('family-tree-area').style.height = chartHeight +"px";

if (browserWidth < 900) {
  middle = -800;
} else {
//  middle = width - chartWidth;
  middle = browserWidth - width;
}
console.log('middle:', middle);

middle = middle  + (-currentScale * 10);

const translateX = middle;
const translateY = 100;


	
		            console.log('translateX  :', translateX );


 chartGroup = svg.append("g")
  .attr("transform", `translate(${translateX},${translateY})`)
  .style("transform-box", "fill-box")
  .style("transform-origin", "top center");

/*
	 chartGroup = svg.append("g")
    .style("display", "block")
    .style("transform-origin", "left top");
*/
    // Create a hierarchical tree layout
    const treeLayout = d3.tree().size([chartWidth , chartHeight]);



// Call the function to center chartGroup within the SVG
centerElementInSVG(chartGroup, d3.select("#family-tree-area"));



 

   // Generate the tree layout using the modified size
  const root = d3.hierarchy(familyData).eachBefore(d => {
        d.y = d.depth * chartWidth + 70; // Adjust the width between nodes as needed
        d.x = d.depth * 100; // Adjust the vertical spacing as needed
    });

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

  //  console.log('Source:', sourceX, sourceY);
   // console.log('Target:', targetX, targetY);

    // Calculate control point coordinates for a curved link
    const controlX = (sourceX + targetX) / 2;
    const controlY = sourceY;// + targetY) / 2;

   // console.log('Control:', controlX, controlY);

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





	


	





    let memberData = familyData;
//console.log('memberData data:', memberData.data);
memberData = memberData.data;
//let memberDataX = memberData();
 	//console.log('memberDataX :', memberDataX);



//console.log('userID :', userID);
const memberIDs = Object.keys(memberData);

//console.log("Member IDs:", memberIDs);

	

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
         bbox = this.getBBox();
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



console.log('chartGroup transform:', chartGroup.attr('transform'));




nodeGroup = chartGroup.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`);


console.log('nodeGroup transform:', nodeGroup.attr('transform'));

	
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
nodes = root.descendants();

// Wait for rendering to complete, then get the bounding boxes
setTimeout(() => {
  bbox = nodeGroup.node().getBBox();  // Correct way to get the bounding box
  console.log('NodeGroup BBox:', bbox);
  
  // Call the handleCollisions function after obtaining the correct bbox
  handleCollisions(nodes);
}, 0);












  

    // Apply the zoom behavior to the SVG
    svg.call(zoom)
        .call(zoom.transform, d3.zoomIdentity.scale(currentScale)); // Apply initial scale



	
// Set the transform attribute
chartGroup.attr("transform", `translate(${middle},${translateY}) scale(${scale})`);

console.log('chartGroup transform:', chartGroup.attr('transform'));


	
function zoomed(event) {
	
  if (event.transform.k === currentScale) {
    console.log('No zoom change');
    return;
  } else {
 currentScale = event.transform.k;

	      console.log(`currentScale of ${currentScale}:`);
  }

  chartGroup.attr('transform', event.transform);

  updateImageAttributes();

// Update the 'd' attribute of the paths to create curved links
chartGroup
    .selectAll('path.link')
    .attr('d', (d) => {
        // Generate the updated path data using the link generator
        const source = { x: d.source.x * currentScale, y: d.source.y * currentScale };
        const target = { x: d.target.x * currentScale, y: d.target.y * currentScale };
        // Update the 'd' attribute with the updated path data
        const updatedPathData = linkGenerator({ source, target });

/*
console.log('Source:', source);
console.log('Target:', target);
console.log('Generated Path:', linkGenerator({ source, target }));
            console.log('updatedPathData :', updatedPathData);
*/
	    
        return updatedPathData;  // Return the updated path data
    });


	
}

//centerElementInSVG(nodeGroup);


}


	

function updateImageAttributes() {
  nodeGroup.selectAll("text")
    .attr("x", d => (d.x - bbox.x) * currentScale)  // Adjust the x position as needed
    .attr("y", d => (d.y - bbox.y - 20) * currentScale);  // Adjust the y position as needed

  nodeGroup.selectAll("image")
    .attr("x", d => -imageWidth / 2) // Adjust positioning based on scale
    .attr("y", d => -imageHeight / 2)
    .attr("width", imageWidth)
    .attr("height", imageHeight);
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
      // Generate the updated path data using the link generator
      const source = { x: d.source.x * currentScale, y: d.source.y * currentScale };
      const target = { x: d.target.x * currentScale, y: d.target.y * currentScale };
      return linkGenerator({ source, target });
    });

  updateImageAttributes();
}


function seeGallery(fam){

  window.location.href = 'https://rw-501.github.io/wefamily/timeline/?fam='+fam; 

}

function findMemberById(memberId) {
  return memberDataMap[memberId] || null;
}

      function populateMemberInfo(member) {
    // Populate image and text
    const memberImage = document.getElementById('memberImage');
    const memberName = document.getElementById('memberName');
    const memberInfo = document.getElementById('memberInfo');
    const memberDetailsList = document.getElementById('memberDetails');

    if (member.photo) {
      memberImage.src = member.photo;
    }

    if (member.name) {
      memberName.textContent = `${member.name} `;
    }

    memberInfo.value = member.bio || member.description || "";

    const memberID = member.id;
    const memberData = memberDataMap[memberID];
    let formattedBirthdate = formatDateToMonthDay(member.birthdate);
    const memberDetails = {};

    if (member.birthdate) {
      memberDetails['Birthdate'] = formattedBirthdate;
    }

    if (member.deceaseddate) {
      memberDetails['Deceased Date'] = member.deceaseddate;
    }

    if (member.contact) {
      memberDetails['Contact'] = member.contact;
    }

    if (member.note) {
      memberDetails['Note'] = member.note;
    }

    if (member.familyCode) {
      memberDetails['Family Code'] = member.familyCode;
    }





	      
    const parentNames = getParentNames(memberID);

    if (parentNames) {
      memberDetails['Parent'] = parentNames;
    }

    const children = displayChildrenNames(memberID, displayChildrenCallback);
    if (Array.isArray(children)) {
      let childrenList = '';
      children.forEach((child, index) => {
        childrenList += '<br>' + child.name + '<br>' || '';
      });
      memberDetails['Children'] = childrenList;
    }

	       const scrollTo = document.getElementById('scrollTo');
   currentMemberData = member;
    if (member.familyCode) {
      scrollTo.innerHTML = `<button onclick="seeGallery('${member.familyCode}');" id="seeGallery">See Gallery</button>`;

    }else{
	            if (member.userID === userID) {

     scrollTo.innerHTML = `<button onclick="editMemberFunc('','${member.id}');" id="seeMember">Edit</button>`;

	    }else if (member.userID === "") {
      scrollTo.innerHTML =  `<button onclick="claimMemberFunc('','${member.id}');" id="seeMember">Claim</button>`;

            }

    }
	      
    const detailsList = document.getElementById('memberDetails');
    detailsList.innerHTML = '';

    for (const [key, value] of Object.entries(memberDetails)) {
      if (value) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${key}:</strong> ${value}`;
        detailsList.appendChild(listItem);
      }
    }
  }



function showMemberPopup(member) {
    const seeMember = document.getElementById('seeMember');

    // Add event listener only if the element with ID 'scrollTo' exists
    if (seeMember) {
        seeMember.addEventListener('click', () => {
            // Check if the current user can edit or claim the member
   
	    console.log('member.userID:', member.userID);

            hideMemberPopup();
        });
    }

    // Set the button label based on the user's permission
 

    // Reset the member's userID to prevent unintentional behavior
  //  member.userID = "";

    // Populate member information
    populateMemberInfo(member);

    // Show the member detail popup
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

var memberDataMap = {};
let rootID = "";

function fetchFamilyMemberData(collectionName, treeID) {
    return new Promise((resolve, reject) => {
        const db = firebase.firestore();
	    memberDataMap = {};
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
                            first_name: first_name,
                            middle_name: middle_name,
                            last_name: last_name,
                            nameSuffix: nameSuffix,
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

const parentsOfParents = getParentsOfParents();

// Log the parents of parents
console.log('ID of the first Parent of Parents:', parentsOfParents[0].id);
		    
        // Update the root to use the member with the most children as the root
        let root = {
  id: treeID,
  name: treeData.name,
  children: maxChildrenCount > 0 ? [memberIDWithMaxDepth] : [treeData.root || rootID],
  data: maxChildrenCount > 0 ? memberDataMap : treeData,
          photo: treeData.photo,
          location: treeData.location,
          description: treeData.description ,
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

//console.log('Children count at each depth:', depthCounts);






		    

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
		    console.log('root:', root);

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

  for (const [memberID, member] of Object.entries(memberDataMap)) {
    const children = member.children;

    if (children) {
      const childIDs = children.map(child => child.id);

      if (childIDs.includes(childID)) {
        parentName = member.name;
        break;
      }
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
 const membersNotListedAsChild = [];

  for (const [memberID, member] of Object.entries(memberDataMap)) {
    let isChild = false;

    // Check if the current member is listed as a child in any other member
    for (const [, otherMember] of Object.entries(memberDataMap)) {
      const children = otherMember.children;
      if (children && children.includes(memberID)) {
        isChild = true;
        break;
      }
    }

    // If the member is not a child, add them to the list
    if (!isChild) {
      membersNotListedAsChild.push({
        id: memberID,
        name: member.name || '',
      });
    }
  }

  return membersNotListedAsChild;
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
