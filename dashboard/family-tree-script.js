


// Sample family data
const familyData = [];

// Create a tree layout
const tree = d3.tree().size([400, 200]);

// Create an SVG container
const svg = d3.select("#family-tree-area");

// Create a hierarchy from the family data
const root = d3.hierarchy({ id: "root", children: familyData });

// Assign coordinates to each node
tree(root);

// Create links between nodes
const links = root.links();

// Create a group for links
const linkGroup = svg
    .append("g")
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("d", (d) => {
        return `
            M${d.source.x},${d.source.y}
            L${d.target.x},${d.target.y}
        `;
    })
    .attr("stroke", "black");

// Create a group for nodes
const nodeGroup = svg
    .append("g")
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`)
    .on("click", (d) => {
        // Handle node click event (e.g., display member details)
        console.log("Clicked node: ", d.data.id);
    });

// Add circles for each node
nodeGroup
    .append("circle")
    .attr("r", 20)
    .attr("fill", "lightblue");

// Add member names
nodeGroup
    .append("text")
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text((d) => d.data.name);

// Add member photos (you should replace the image paths with actual URLs)
nodeGroup
    .append("image")
    .attr("xlink:href", (d) => d.data.photo)
    .attr("width", 40)
    .attr("height", 40)
    .attr("x", -20)
    .attr("y", -20);





function fetchFamilyMemberData(collectionName, treeID) {
    return new Promise((resolve, reject) => {
        const jsonData = {};

        // Fetch data from Firestore
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

                    // Create an object for the current member
                    const memberData = {
                        id: id,
                        name: name,
                        photo: photo,
                        children: children,
                        spouse: spouse,
                        parents: parents,
                        siblings: siblings,
                    };

                    // Add the member data to jsonData using the member's ID as the key
                    jsonData[id] = memberData;
                });

                // Resolve the promise with the formatted JSON data
                resolve(jsonData);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Usage example:
fetchFamilyMemberData('familyMembers', currentFamilyID)
    .then((jsonData) => {
        // Now 'jsonData' contains your Firestore data in the desired format
        // Each member object includes the relationships

        // Optionally, you can convert it to a JSON string
        const jsonString = JSON.stringify(jsonData, null, 2);
        console.log("familyData   "+jsonString);
      
familyData = jsonString;
        // You can use the JSON data for further processing or export it as needed
    })
    .catch((error) => {
        console.error('Error fetching family member data:', error);
    });

