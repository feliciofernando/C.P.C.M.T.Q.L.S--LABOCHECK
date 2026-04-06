module.exports = {
  apps: [{
    name: "labocheck",
    script: "npx",
    args: "next dev -p 3000",
    cwd: "/home/z/my-project/C.P.C.M.T.Q.L.S--LABOCHECK",
    watch: false,
    restart_delay: 3000,
    max_restarts: 50,
    kill_timeout: 5000,
    env: {}
  }]
}
