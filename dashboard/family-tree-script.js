

function generateFamilyTreeChart(familyData) {
    const width = 800; // Width of the chart
    const height = 400; // Height of the chart
    console.log("generateFamilyTreeChart   " + familyData);

    // Create an SVG element to contain the chart
    const svg = d3.select("#family-tree-area")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a hierarchical tree layout
    const treeLayout = d3.tree().size([width, height]);


// Fake family tree data with siblings
let  xxxfamilyData = {
    id: 'root',
    name: 'Family Tree',
    children: [
        {
            id: 'child1',
            name: 'John Doe',
            children: [
                {
                    id: 'sibling1',
                    name: 'Jane Doe',
                    children: [],
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

    // Create links between parent and child nodes
    const links = root.links();

    // Create a group element to hold the links
    const linkGroup = svg.append("g");

    // Create a group element to hold the nodes
    const nodeGroup = svg.append("g");

    // Draw links
    linkGroup.selectAll("path")
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

    // You can further style and customize the chart as needed
}




function fetchFamilyMemberData(collectionName, treeID) {
    return new Promise((resolve, reject) => {
        const db = firebase.firestore();

        // Fetch data from Firestore
        db.collection(collectionName)
            .where('familyID', 'array-contains', treeID)
            .get()
            .then((querySnapshot) => {
                // Initialize the root object with the correct child ID
                const root = {
                    id: treeID, // A unique identifier for the root node
                    name: "McClure Family", // Set the root node's name (you can change this)
                    children: [], // Initialize an empty children array
                };

                // Create a map to store member data by ID
                const memberDataMap = {};
let countChild = 0;

                // Build the tree starting from the root
function buildTree(node) {
                    node.children = (node.children || []).map((childID) => {
                        const childNode = memberDataMap[childID];
                        if (childNode) {
                            return buildTree(childNode);
                        }
                        return null; // Handle the case where childNode is undefined or missing
                    });

                    // Filter out any null values (nodes without valid children)
                    node.children = node.children.filter(Boolean);

                    return node;
                }


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
root.children.push(memberData.id);
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


