/**
 * @param {number[]} robot
 * @param {number[][]} factory
 * @return {number}
 */
var minimumTotalDistance = function(robot, factory) {
    factory.sort((a, b) => a[0] - b[0]);
    let n = robot.length, m = factory.length;
    let dp = new Array(n + 1).fill(0).map(() => new Array(m + 1).fill(Number.MAX_SAFE_INTEGER));
    dp[0][0] = 0;
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            dp[i][j] = dp[i][j - 1];
            let cost = 0;
            for (let k = i; k > 0; k--) {
                cost += Math.abs(robot[k - 1] - factory[j - 1][0]);
                if (cost >= dp[i][j]) break;
                dp[i][j] = Math.min(dp[i][j], dp[k - 1][j - 1] + cost);
            }
        }
    }
    return dp[n][m];  
};