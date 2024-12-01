var Tree = function() {
    this.root = null;
}

Tree.prototype.insert = function(node, data) {
    if (node == null){
    	node = new Node(data);
    }
 	else if (data < node.data){
        node.left  = this.insert(node.left, data);
    }
    else{
        node.right = this.insert(node.right, data);   
    }

    return node;
}

var Node = function(data) {
    this.data = data;
    this.left = null;
    this.right = null;
}
/* head ends */

/*
    Node is defined as
    var Node = function(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
*/

// This is a "method-only" submission.
// You only need to complete this method.

function treeHeight(root) {
	if (root != null){
        //-----
        // Esta condición es basica, porque si es el ultimo regresa cero pero si hay al menos un hijo, regresa uno
        var height = (root.left != null || root.right != null) ? 1 : 0; 
        //-----

        //console.log("Root: " + root.data + " Height: " + height);

    	let leftHeight = height + treeHeight(root.left);
        let rightHeight = height + treeHeight(root.right);

    	return Math.max(leftHeight, rightHeight);
    }
    else{
        return 0;
    }
}

/* tail begins */

process.stdin.resume();
process.stdin.setEncoding('ascii');

var _stdin = "";
var _stdin_array = "";
var _currentline = 0;

process.stdin.on('data', function(data) {
    _stdin += data;
});

//7
//3 5 2 1 4 6 7
process.stdin.on('end', function() {
    _stdin_array = _stdin.split(" ");
    solution();
});

function readLine() {
    return _stdin_array[_currentline++];
}

function solution() {
    var tree = new Tree();
    var n = parseInt(readLine());

    for (let i = 0; i < n; i++) {
        let m = parseInt(readLine());

    
        tree.root = tree.insert(tree.root, m);
    }

    var height = treeHeight(tree.root);
    process.stdout.write(height.toString() + "\n");
}