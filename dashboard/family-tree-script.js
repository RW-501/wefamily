// Add a zoom control UI
const zoomControls = document.getElementById('zoom-controls');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');

// Define zoom behavior and initial scale
const initialScale = 1;
let currentScale = initialScale;




    // Create a group element to hold the links
       var chartGroup; 

function generateFamilyTreeChart(familyData) {
	

const width = window.screen.width;
    const height = 1500 ;//*  maxHierarchyDepth; // Height of the chart

    // Create an SVG element to contain the chart
    const svg = d3.select("#family-tree-area")
        .append("svg")
        .attr("width", width)
        .attr("height", height);



     const height_Layout = 800;
    // Create a hierarchical tree layout
    const treeLayout = d3.tree().size([width, height_Layout]);
    
chartGroup  = svg.append("g");
	
	    console.log("maxHierarchyDepth   " + maxHierarchyDepth);
	    console.log("chartGroup   " + chartGroup);

	// Add click event listeners for zoom controls
zoomInButton.addEventListener('click', () => {
    const newScale = currentScale * 1.2; // Increase scale by 20%
    applyZoom(newScale);
});

zoomOutButton.addEventListener('click', () => {
    const newScale = currentScale / 1.2; // Decrease scale by 20%
    applyZoom(newScale);
});

let familyData = {
    id: 'root',
    name: 'Family Tree 333',
    children: [
        {
            id: 'child1',
            name: 'John Doe',
            children: [
                {
                    id: 'sibling1',
                    name: 'Jane Doe',
                    children: [                {
                                                id: 'child',
                                                name: 'grand Doe',
                                                children: [],
                                                    },
                              ],
                },
                {
                    id: 'sibling2',
                    name: 'Bob Doe',
                    children: [],
                },
            ],
        },
        {
            id: 'child2',
            name: 'Alice Doe',
            children: [],
        },
    ],
};
    
// Create a root node for the tree with an initial y-coordinate of 50
const root = d3.hierarchy(familyData).eachBefore(d => {
    d.y = d.depth * 100 + 50; // Adjust the '100' for your desired vertical spacing
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
        .attr("dy", -35) // Adjust the vertical position of labels
        .attr("text-anchor", "middle")
        .text(d => d.data.name) // Display member names
    .on("click", function (event, d) {
        // 'd' contains the data associated with the clicked link
        console.log("Clicked text Data:", d.data);
        // You can now use d.data to access relationship information
    });
    const imageWidth = 100;

    const imageHeight = 100;

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

    if (!chartGroup) {
        console.error('chartGroup is not defined. Ensure that it is properly initialized.');
        return;
    }

    chartGroup.selectAll("circle")
        .attr("r", 20 / scale);

    chartGroup.selectAll("text")
        .attr("font-size", 14 / scale);

    chartGroup.selectAll("image")
        .attr("width", 100 / scale)
        .attr("height", 100 / scale);

    chartGroup.selectAll("path.link")
        .attr("stroke-width", 2 / scale);
	/*
const translateY = 100;
    // Set the transform attribute
chartGroup.attr("transform", `translate(0 ,${translateY}) scale(${scale})`);
	*/
    chartGroup.selectAll("path.link")
        .attr("d", d => {
            const source = { x: d.source.x * scale, y: d.source.y };
            const target = { x: d.target.x * scale, y: d.target.y };
            return linkGenerator({ source, target });
        });
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
let maxHierarchyDepth = 0; // Move this outside the function


function fetchFamilyMemberData(collectionName, treeID, treeData) {
    return new Promise((resolve, reject) => {
        const db = firebase.firestore();

        const root = {
            id: 'root',  // Change the root id to a fixed value 'root'
            name: treeData.name,
            children: [],
        };

    

        db.collection(collectionName)
            .where('familyID', 'array-contains', treeID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    const id = doc.id;
                    const name = `${docData.first_name} ${docData.last_name}`;
                    const photo = docData.photo || '';
                    const children = docData.children || [];
                    const spouse = docData.spouse || [];
                    const parents = docData.parents || [];
                    const siblings = docData.sibling || [];

 if (treeData.root) {

			  root.children.push(treeData.root);
                    } else {
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
/*
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
		    */
                   });

                const hierarchicalTree = buildTree(root, 1000, new Set(), 0);
                maxHierarchyDepth = hierarchicalTree.maxDepth;
                resolve({ hierarchicalTree, maxHierarchyDepth });
            })
            .catch((error) => {
                reject(error);
            });
    });
}





function buildTree(node, depthLimit, processedNodes, currentDepth) {
    if (depthLimit <= 0 || !node || !Array.isArray(node.children) || processedNodes.has(node.id)) {
        return { node, maxDepth: currentDepth };
    }

    processedNodes.add(node.id);

    const childResults = (node.children || []).map((child) => {
        return buildTree(child, depthLimit - 1, processedNodes, currentDepth + 1);
    });

    const maxChildDepth = Math.max(...childResults.map((result) => result.maxDepth));

    node.children = childResults.map((result) => result.node);

    return { node, maxDepth: Math.max(currentDepth, maxChildDepth) };
}




function loadFamilyTreeChart(treeData) {
    fetchFamilyMemberData('familyMembers', currentFamilyID, treeData)
        .then((result) => {
            console.log("Hierarchical tree data:", result.hierarchicalTree);
            console.log("Max hierarchy depth:", result.maxHierarchyDepth);
            // Call your chart generation function here with the hierarchical tree
        })
        .catch((error) => {
            console.error('Error fetching family member data:', error);
        });
}

