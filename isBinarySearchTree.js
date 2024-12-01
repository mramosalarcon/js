function processData(root) {
    // Helper function to check if node values are within valid range
    function isValidBST(node, min, max) {
        // Empty tree is valid
        if (!node) return true;
        
        // Check if current node's value is within valid range
        if (node.data <= min || node.data >= max) {
            return false;
        }
        
        // Recursively check left and right subtrees
        // Left subtree values must be less than current node
        // Right subtree values must be greater than current node
        return isValidBST(node.left, min, node.data) && 
               isValidBST(node.right, node.data, max);
    }
    
    // Start the validation with initial range (-Infinity, Infinity)
    return isValidBST(root, -Infinity, Infinity);
}

// Example node structure
class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}
