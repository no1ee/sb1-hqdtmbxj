module.exports = {
  apps: [{
    name: 'sb1-analysis',
    script: 'server.js',
    cwd: '/home/username/nodejs/server',
    watch: true,
    env: {
      NODE_ENV: 'production',
    },
    instances: 1,
    exec_mode: 'fork'
  }]
}
