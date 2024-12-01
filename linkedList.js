/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    if (!head || !head.next) {
        return false; // If the list is empty or has only one node, there can be no cycle.
    }

    let slow = head;
    let fast = head.next; // Initialize fast to the second node.

    while (slow !== fast) {
        if (!fast || !fast.next) {
            return false; // If fast reaches the end of the list, there's no cycle.
        }
        slow = slow.next;
        fast = fast.next.next;
    }

    return true;
};