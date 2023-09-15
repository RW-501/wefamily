// Add a zoom control UI
const zoomControls = document.getElementById('zoom-controls');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');

// Define zoom behavior and initial scale
const initialScale = 1;
let currentScale = initialScale;


// Add click event listeners for zoom controls
zoomInButton.addEventListener('click', () => {
    const newScale = currentScale * 1.2; // Increase scale by 20%
    applyZoom(newScale);
});

zoomOutButton.addEventListener('click', () => {
    const newScale = currentScale / 1.2; // Decrease scale by 20%
    applyZoom(newScale);
});


    // Create a group element to hold the links
    var chartGroup; 

function generateFamilyTreeChart(familyData) {
    const width = 1000; // Width of the chart
    const height = 1500; // Height of the chart
    console.log("generateFamilyTreeChart   " + familyData);

    // Create an SVG element to contain the chart
    const svg = d3.select("#family-tree-area")
        .append("svg")
        .attr("width", width)
        .attr("height", height);



     const height_Layout = 800;
    // Create a hierarchical tree layout
    const treeLayout = d3.tree().size([width, height_Layout]);
    
chartGroup  = svg.append("g");

    


    
    // Create a root node for the tree
// Create a root node for the tree with an initial y-coordinate of 50
const root = d3.hierarchy(familyData).eachBefore(d => {
    d.y = d.depth * 10 + 50; // Adjust the '100' for your desired vertical spacing
});

    // Assign coordinates to each node in the tree
    treeLayout(root);

// Create a link generator with zoom transformation
    const linkGenerator = d3.linkHorizontal()
        .x(d => d.x) // Swap x and y due to vertical tree layout
        .y(d => d.y);

    // Initialize zoom with the initial scale
    const zoom = d3.zoom()
        .scaleExtent([0.5, 5]) // Define the zoom scale limits
        .on("zoom", zoomed);

    // Create links between parent and child nodes
    const links = root.links();

    const imageWidth = 200;

    const imageHeight = 200;

// Append images to nodes
chartGroup.selectAll("image")
    .data(root.descendants())
    .enter()
    .append("image")
    .attr("xlink:href", d => d.data.photo) // Set the image URL
    .attr("x", d => d.x - imageWidth / 2) // Adjust the positioning
    .attr("y", d => d.y - imageHeight / 2) // Adjust the positioning
    .attr("width", imageWidth)
    .attr("height", imageHeight)
    .on("click", function (event, d) {
        // 'd' contains the data associated with the clicked node
        console.log("Clicked image Data:", d.data);
        // You can now use d.data to access member information
    });

// Add click event listener to nodes
chartGroup.selectAll("circle")
    .data(root.descendants())
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 20) // Radius of circles
    .on("click", function (event, d) {
        // 'd' contains the data associated with the clicked node
        console.log("Clicked circle Data:", d.data);
        // You can now use d.data to access member information
    });

    // Add text labels to nodes
    chartGroup.selectAll("text")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", -25) // Adjust the vertical position of labels
        .attr("text-anchor", "middle")
        .text(d => d.data.name) // Display member names
    .on("click", function (event, d) {
        // 'd' contains the data associated with the clicked link
        console.log("Clicked text Data:", d.data);
        // You can now use d.data to access relationship information
    });



// Draw custom links between nodes
chartGroup.selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d => {
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        return `M${sourceX},${sourceY} L${targetX},${targetY}`;
    })
    .style("fill", "none")
    .style("stroke", "gray")
    .style("stroke-width", 2);

    
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
        chartGroup.attr("transform", event.transform);

        // Apply the same zoom transformation to the link lines
        chartGroup.selectAll("path.link")
            .attr("d", d => {
                // Generate the updated path data using the link generator
                const source = { x: d.source.x * currentScale, y: d.source.y * currentScale };
                const target = { x: d.target.x * currentScale, y: d.target.y * currentScale };
                return linkGenerator({ source, target });
            });
    }
}

// Create the zoom function
function applyZoom(scale) {
    currentScale = scale;
   chartGroup.attr("transform", `scale(${scale})`); // Apply the zoom transformation to the chartGroup

    
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
			                    console.log(' rootValue.',rootValue);
    // Reference to the document in the collection
    const docRef = db.collection("familyTrees").doc(treeData.name);

    // Update the document with the new root value
    return docRef.update({ root: rootValue })
        .then(() => {
            console.log(`Root value updated successfully for document with ID:`);
        })
        .catch((error) => {
            console.error(`Error updating root value: ${error}`);
        });
}




        const memberDataMap = {};



                

function fetchFamilyMemberData(collectionName, treeID) {
    return new Promise((resolve, reject) => {
        const db = firebase.firestore();

        // Initialize the root object with the correct child ID
        const root = {
            id: treeID, // A unique identifier for the root node
    name: treeData.name, // The name of the root node
            children: [], // Include childID in the children array
        };
      
   

        // Fetch data from Firestore
        db.collection(collectionName)
            .where('familyID', 'array-contains', treeID)
            .get()
            .then((querySnapshot) => {
                                const querySnapshotCount = querySnapshot.size;

                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    const id = doc.id;
                    const name = `${docData.first_name} ${docData.last_name}`;
                    const photo = docData.photo || '';
                    const children = docData.children || [];
                    const spouse = docData.spouse || [];
                    const parents = docData.parents || [];
                    const siblings = docData.sibling || [];
       if(treeData.root){
                                         root.children.push(treeData.root);

             }else{
                                   root.children.push(id);

             } 
                    // Check if the member is not already in memberDataMap and map them
                    if (!memberDataMap[id]) {
                        const memberData = {
                            id: id,
                            name: name,
                            photo: photo,
                            children: children,
                            spouse: spouse,
                            parents: parents,
                            siblings: siblings,
                            // You can add more properties here if needed
                        };

                        // Store member data in the map
                        memberDataMap[id] = memberData;
                    }

                  
     
                    // Check and update parent and sibling relationships
                    parents.forEach((parentsID) => {
                        if (memberDataMap[parentsID]) {
                            // Update childNode's parent
                            memberDataMap[parentsID].children.push(id);
                            // Update current member's child
                            memberDataMap[id].parents.push(parentsID);
                        }
                    });

                    children.forEach((childID) => {
                        if (memberDataMap[childID]) {
                            // Update childNode's parent
                            memberDataMap[childID].parents.push(id);
                            // Update current member's child
                            memberDataMap[id].children.push(childID);
                        }
                    });

                    siblings.forEach((siblingID) => {
                        if (memberDataMap[siblingID]) {
                            // Update siblingNode's sibling
                            memberDataMap[siblingID].siblings.push(id);
                            // Update current member's sibling
                            memberDataMap[id].siblings.push(siblingID);
                        }
                    });

                    spouse.forEach((spouseID) => {
                        if (memberDataMap[spouseID]) {
                            // Update spouseNode's spouse
                            memberDataMap[spouseID].spouse.push(id);
                            // Update current member's spouse
                            memberDataMap[id].spouse.push(spouseID);
                        }
                    });
                });

                // Build the tree starting from the root
                const hierarchicalTree = buildTree(root,querySnapshotCount, new Set());

                // Resolve the promise with the hierarchical tree structure
                resolve(hierarchicalTree);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function buildTree(node, depthLimit, processedNodes) {
    if (depthLimit <= 0 || processedNodes.has(node.id)) {
        return node;
    }

    processedNodes.add(node.id);

    const uniqueChildren = {};
    
    node.children = (node.children || []).map((childID) => {
        const childNode = memberDataMap[childID];
        if (childNode) {
            if (!uniqueChildren[childID]) {
                uniqueChildren[childID] = true;
                return buildTree(childNode, depthLimit - 1, processedNodes);
            }
        }
        return null;
    });

    node.children = node.children.filter(Boolean);

    return node;
}






function loadFamilyTreeChart() {
    console.log("currentFamilyID   " + currentFamilyID);
    
    fetchFamilyMemberData('familyMembers', currentFamilyID)
        .then((hierarchicalTree) => {
            console.log("Hierarchical tree data:", hierarchicalTree); // Log the data
            // Now 'hierarchicalTree' contains your Firestore data in a hierarchical structure

            // Call the function to generate the family tree chart with your family data
            generateFamilyTreeChart(hierarchicalTree);
            console.log("Family tree chart generated."); // Log when the chart is generated
            // You can use the hierarchical tree structure for rendering the chart
        })
        .catch((error) => {
            console.error('Error fetching family member data:', error);
        });
}


