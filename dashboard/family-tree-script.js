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

// Create a link generator with zoom transformation
const linkGenerator = d3.linkHorizontal()
    .x(d => d.y) // Swap x and y due to vertical tree layout
    .y(d => d.x);

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

    // Create a hierarchical tree layout
    const treeLayout = d3.tree().size([width, height]);
    
chartGroup  = svg.append("g");

// Fake family tree data with siblings
familyData = {
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


    
    // Create a root node for the tree
    const root = d3.hierarchy(familyData);

    // Assign coordinates to each node in the tree
    treeLayout(root);

// Initialize zoom with the initial scale
const zoom = d3.zoom()
    .scaleExtent([0.5, 5]) // Define the zoom scale limits
    .on("zoom", zoomed);




    
    // Create links between parent and child nodes
    const links = root.links();


    // Create a group element to hold the nodes
    const nodeGroup = svg.append("g");

    // Draw links
    chartGroup.selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("d", d => {
            return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
        });

    // Draw nodes (circles for now)
    nodeGroup.selectAll("circle")
        .data(root.descendants())
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 20); // Radius of circles

    // Add text labels to nodes
    nodeGroup.selectAll("text")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", -25) // Adjust the vertical position of labels
        .attr("text-anchor", "middle")
        .text(d => d.data.name); // Display member names

   

    
// Apply the zoom behavior to the SVG
svg.call(zoom)
    .call(zoom.transform, d3.zoomIdentity.scale(initialScale)); // Apply initial scale

// Define the zoom function
function zoomed(event) {
    // Apply the zoom transformation to the chartGroup
    chartGroup.attr("transform", event.transform);

    // Apply the same zoom transformation to the link lines
    chartGroup .selectAll("path")
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





function fetchFamilyMemberData(collectionName, treeID) {
    return new Promise((resolve, reject) => {
        const db = firebase.firestore();

        // Fetch data from Firestore
        db.collection(collectionName)
            .where('familyID', 'array-contains', treeID)
            .get()
            .then((querySnapshot) => {
     
                
    console.log("treeData   " + treeData.name);
let childID = treeData.adminID;
   // console.log("childID   " + childID);

          // Initialize the root object with the correct child ID
const root = {
    id: treeID, // A unique identifier for the root node
    name: treeData.name, // The name of the root node
    children: [], // Include childID in the children array
};
         //    root.children.push(childID);
                // Create a map to store member data by ID
                const memberDataMap = {};
let countChild = 0;

                // Build the tree starting from the root
function buildTree(node, depth) {
    // Check if depth exceeds a certain limit (e.g., 3)
    if (depth >= 3) {
        return node; // Stop recursion
    }

    node.children = (node.children || []).map((childID) => {
        const childNode = memberDataMap[childID];
        if (childNode) {
            return buildTree(childNode, depth + 1); // Increase depth
        }
        return null; // Handle the case where childNode is undefined or missing
    });

    // Filter out any null values (nodes without valid children)
    node.children = node.children.filter(Boolean);

    return node;
}

// In your fetchFamilyMemberData function, start with depth 0
//fetchFamilyMemberData('familyMembers', currentFamilyID, 0)



                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    const id = doc.id;
                    const name = `${docData.first_name} ${docData.last_name}`;
                    const photo = docData.photo || '';
                    const children = docData.children || [];
                    const spouse = docData.spouse || [];
                    const parents = docData.parents || [];
                    const siblings = docData.sibling || [];

                    // Create an object for the current member
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
 //   console.log("memberData   " + memberData.name);

                    countChild++;
                    if(countChild === 1){
root.children.push("85AoEIm6sppejYT6MA2b");
console.log("childID   " + memberData.id);
console.log("childID   " + childID);
                    
                    }
                            // Store member data in the map
                    memberDataMap[id] = memberData;

                    // Check and update parent and sibling relationships
                    children.forEach((childID) => {
                        const childNode = memberDataMap[childID];
                        if (childNode) {
                            // Update childNode's parent
                            childNode.parents.push(id);
                            // Update current member's child
                            memberData.children.push(childID);
                        }
                    });

                    siblings.forEach((siblingID) => {
                        const siblingNode = memberDataMap[siblingID];
                        if (siblingNode) {
                            // Update siblingNode's sibling
                            siblingNode.siblings.push(id);
                            // Update current member's sibling
                            memberData.siblings.push(siblingID);
                        }
                    });

                    spouse.forEach((spouseID) => {
                        const spouseNode = memberDataMap[spouseID];
                        if (spouseNode) {
                            // Update spouseNode's spouse
                            spouseNode.spouse.push(id);
                            // Update current member's spouse
                            memberData.spouse.push(spouseID);
                        }
                    });
                });

                // Build the tree starting from the root
                const hierarchicalTree = buildTree(root);

                // Resolve the promise with the hierarchical tree structure
                resolve(hierarchicalTree);
            })
            .catch((error) => {
                reject(error);
            });
    });
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


