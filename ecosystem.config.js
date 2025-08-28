module.exports = {
    apps: [
      {
        name: "nextjs-app",
        script: "server.js",
        instances: 1,          // Fork mode: 1 instance per container
        exec_mode: "fork",     // Do NOT use cluster mode
        watch: false,
        env: {
          NODE_ENV: "production",
          PORT: 3000,
          HOSTNAME: "0.0.0.0"
        }
      }
    ]
  };
  