
// Esta funcion es para crear los nodos del arbol
function Node(data, depth) {
    this.data = data;
    this.depth = depth || 1;
    this.left = null;
    this.right = null;
}

//Funcion recursiva para leer el arbol de en orden transversal
function inOrderTraversal(node, arr) {
    if (node.left) inOrderTraversal(node.left, arr);
    arr.push(node.data);
    if (node.right) inOrderTraversal(node.right, arr);
}

function swapNodes(indexes, queries) {
    //let tree = [new Node(1, 1)]; // Crea el primer nodo del arbol
    let tree = [];
    let result = [];

    // Este primer for es para armar el arbol con el parametro indexes
    // indexes = [
    //    [2, 3],
    //    [-1, -1],
    //    [-1, -1]
    //];

    for (let i = 0; i < indexes.length; i++) {
        // Busca el dato en el arbol y regresa la primera ocurrencia
        // La primera vez busca el nodo 1 (root)
        let node = tree.find(n => n.data == i + 1); 
        
        // Validación para asegurar que existe el primer elemento
        if (!node) {
            node = new Node(i + 1);
            tree.push(node);
        }

        node.left = indexes[i][0] == -1 ? null : new Node(indexes[i][0], node.depth + 1);
        node.right = indexes[i][1] == -1 ? null : new Node(indexes[i][1], node.depth + 1);

        if (node.left) tree.push(node.left);
        if (node.right) tree.push(node.right);
    }

    // Este for es para hacer el swap por cada multiplo de k
    // queries = [1, 1];
    for (let i = 0; i < queries.length; i++) {
        let k = queries[i];
        // Barre todo el arreglo del arbol buscando los multiplos de k para 
        // encontrar el nivel que hay que hacer swap
        for (let j = 0; j < tree.length; j++) {
            if (tree[j].depth % k == 0) {
                let temp = tree[j].left;
                tree[j].left = tree[j].right;
                tree[j].right = temp;
            }
        }

        // Esto lo hace al final para pintar el resultado de cada swap
        let inOrder = [];
        inOrderTraversal(tree[0], inOrder);
        result.push(inOrder);
    }
    return result;
}



var indexes = [
    [2, 3],
    [-1, -1],
    [-1, -1]
];
var queries = [1, 1];
var result = swapNodes(indexes, queries);
console.log(result);

    
