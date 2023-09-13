





function generateFamilyTreeChart(familyData) {
    const width = 800; // Width of the chart
    const height = 400; // Height of the chart

    // Create an SVG element to contain the chart
const svg = d3.select("#family-tree-area")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a hierarchical tree layout
    const treeLayout = d3.tree().size([width, height]);

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
                // Create an empty root node
                const root = {
                    id: 'root', // A unique identifier for the root node
                    name: 'Family Tree', // The name of the root node
                    children: [], // An array to store child nodes
                };

                // Create a map to store member data by ID
                const memberDataMap = {};

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

                    // Store member data in the map
                    memberDataMap[id] = memberData;
                });

                // Create the hierarchical tree structure
                function buildTree(node) {
                    node.children = node.children.map((childID) => {
                        const childNode = memberDataMap[childID];
                        return buildTree(childNode);
                    });
                    return node;
                }

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
            // Now 'hierarchicalTree' contains your Firestore data in a hierarchical structure
            // Each member object includes the relationships and children as nodes

            // Call the function to generate the family tree chart with your family data
            generateFamilyTreeChart(hierarchicalTree);
            // You can use the hierarchical tree structure for rendering the chart
        })
        .catch((error) => {
            console.error('Error fetching family member data:', error);
        });
}





