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

process.stdin.resume();
process.stdin.setEncoding("ascii");
var input = "";
process.stdin.on("data", function (chunk) {
    input += chunk;
});
process.stdin.on("end", function () {
    // now we can read/parse input
    var lines = input.split('\n');
    var n = parseInt(lines[0]);
    var arr = lines[1].split(' ').map(Number);
    var tree = new Tree();
    for (var i=0; i<n; i++) {
        tree.root = tree.insert(tree.root, arr[i]);
    }
    levelOrder(tree.root);
    function levelOrder(root) {
        var queue = [];
        queue.push(root);
        while (queue.length > 0) {
            var node = queue.shift();
            process.stdout.write(node.data + " ");
            if (node.left != null) {
                queue.push(node.left);
            }
            if (node.right != null) {
                queue.push(node.right);
            }
        }
    }
    
});

/* tail begins */

process.stdin.resume();
process.stdin.setEncoding('ascii');

var _stdin = "";
var _stdin_array = "";
var _currentline = 0;

process.stdin.on('data', function(data) {
    _stdin += data;
});

process.stdin.on('end', function() {
    _stdin_array = _stdin.split("\n");
    solution();
});

function readLine() {
    return _stdin_array[_currentline++];
}

function solution() {

    var tree = new Tree();
    var n = parseInt(readLine());
    var m = readLine().split(" ").map(Number);
    for (var i=0; i<n; i++) {
        tree.root = tree.insert(tree.root, m[i]);
    }

    levelOrder(tree.root);
}