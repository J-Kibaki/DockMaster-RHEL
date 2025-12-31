# DockMaster RHEL

A comprehensive interactive learning platform to master Docker in RHEL9 environments.

## Development

```bash
npm install
npm run dev
```

## Docker Deployment

This application is containerized using a multi-stage Docker build (Node.js for building, Nginx for serving).

### Prerequisites
- Docker installed on your machine.

### Build the Image

```bash
docker build -t dockmaster-rhel .
```

### Run the Container

```bash
docker run -d -p 8080:80 --name dockmaster dockmaster-rhel
```

The application will be accessible at `http://localhost:8080`.

### Environment Variables

If you are using the AI Tutor features, you must pass the API Key at runtime (note: this requires updating the frontend to accept runtime config, or rebuilding with the ENV var baked in, though strictly `process.env` in Vite is build-time).

For production usage of the API key, it is recommended to proxy the requests or inject the variable during the build time if using client-side calls.

```bash
# Example passing build arg if configured
docker build --build-arg VITE_API_KEY=your_key -t dockmaster-rhel .
```
