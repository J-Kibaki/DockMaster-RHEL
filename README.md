# DockMaster-RHEL

A comprehensive interactive learning platform to master Docker in RHEL9 environments. DockMaster-RHEL provides a hands-on roadmap that takes users from basic Docker installation to advanced security and orchestration techniques, all optimized for Red Hat Enterprise Linux.

## 🚀 Project Overview

**DockMaster-RHEL** is built with a modern **TypeScript + React** stack:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: TailwindCSS for responsive, utility-first design
- **AI Integration**: Google Gemini AI for intelligent tutoring features
- **Target Platform**: RHEL 9 (Red Hat Enterprise Linux)

The application offers an interactive terminal-like experience where learners can practice Docker commands with real-time feedback and AI-powered assistance.

## 📋 Prerequisites

Before running DockMaster-RHEL, ensure you have the following installed on your RHEL host:

- **RHEL 9** or compatible distribution
- **Node.js** >= 18.x
- **npm** >= 9.x (comes with Node.js)
- **Docker** or **Podman** (for containerized deployments)
- **git** (for cloning the repository)

### Installing Prerequisites on RHEL 9

```bash
# Enable required repositories
sudo dnf install -y nodejs npm git

# Install Docker (option 1)
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io
sudo systemctl enable --now docker

# OR Install Podman (option 2 - native to RHEL)
sudo dnf install -y podman podman-compose
```

## 📁 Project Structure

```
DockMaster-RHEL/
├── components/              # React components
│   ├── LessonContent.tsx   # Lesson display component
│   ├── Sidebar.tsx         # Navigation sidebar
│   └── Terminal.tsx        # Interactive terminal emulator
├── services/               # External service integrations
│   └── geminiService.ts   # Google Gemini AI integration
├── constants.ts           # Application constants and roadmap data
├── types.ts              # TypeScript type definitions
├── App.tsx               # Main application component
├── index.tsx             # Application entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
├── Dockerfile            # Docker build configuration
├── nginx.conf            # Nginx web server config (for production)
└── README.md            # This file
```

## 🛠️ NPM Scripts

The following npm scripts are available for development and production:

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start Vite development server with hot reload (default port: 5173) |
| **build** | `npm run build` | Compile TypeScript and build production-optimized bundle |
| **preview** | `npm run preview` | Preview production build locally before deployment |

### Examples

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration via Environment Variables

DockMaster-RHEL supports configuration through environment variables, primarily for the AI Tutor feature:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `API_KEY` | Google Gemini API key for AI tutoring features | `''` | No (AI features disabled without it) |
| `VITE_API_KEY` | Build-time API key (Vite convention) | `''` | No |
| `NODE_ENV` | Runtime environment (`development` or `production`) | `development` | No |
| `PORT` | Port for Vite dev server | `5173` | No |

### Setting Environment Variables

**For local development:**

```bash
# Create a .env file in the project root
echo "API_KEY=your_gemini_api_key_here" > .env

# Or export directly
export API_KEY=your_gemini_api_key_here
npm run dev
```

**For production builds:**

```bash
# Vite processes environment variables at build time
VITE_API_KEY=your_api_key npm run build
```

**Note**: Environment variables in Vite are processed at build time for client-side code. For production deployments, consider using a proxy server or backend service to handle API keys securely rather than embedding them in the frontend bundle.

## 🖥️ Local Development

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/J-Kibaki/DockMaster-RHEL.git
cd DockMaster-RHEL

# 2. Install dependencies
npm install

# 3. (Optional) Configure API key for AI features
export API_KEY=your_gemini_api_key

# 4. Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Development Workflow

1. **Make changes** to source files (TypeScript/React components)
2. **Hot reload** automatically updates the browser
3. **Test features** in the interactive terminal
4. **Build** for production when ready: `npm run build`

## 🐳 Container Workflows

DockMaster-RHEL supports both **Docker** and **Podman** for containerized deployments.

### Using Docker

#### Build the Image

```bash
# Basic build
docker build -t dockmaster-rhel:latest .

# Build with API key (build argument)
docker build --build-arg VITE_API_KEY=your_api_key -t dockmaster-rhel:latest .
```

#### Run the Container

```bash
# Run with port mapping
docker run -d -p 8080:80 --name dockmaster dockmaster-rhel:latest

# Run with environment variables
docker run -d -p 8080:80 \
  -e NODE_ENV=production \
  --name dockmaster \
  dockmaster-rhel:latest
```

Access the application at `http://localhost:8080`.

#### Docker Commands Reference

```bash
# View running containers
docker ps

# View logs
docker logs dockmaster

# Stop container
docker stop dockmaster

# Remove container
docker rm dockmaster

# Remove image
docker rmi dockmaster-rhel:latest
```

### Using Podman

Podman is the default container runtime on RHEL and provides a Docker-compatible CLI.

#### Build the Image

```bash
# Basic build
podman build -t dockmaster-rhel:latest .

# Build with API key
podman build --build-arg VITE_API_KEY=your_api_key -t dockmaster-rhel:latest .
```

#### Run the Container

```bash
# Run with port mapping
podman run -d -p 8080:80 --name dockmaster dockmaster-rhel:latest

# Run with environment variables
podman run -d -p 8080:80 \
  -e NODE_ENV=production \
  --name dockmaster \
  dockmaster-rhel:latest
```

#### Podman Commands Reference

```bash
# View running containers
podman ps

# View logs
podman logs dockmaster

# Stop container
podman stop dockmaster

# Remove container
podman rm dockmaster

# Remove image
podman rmi dockmaster-rhel:latest
```

### Docker Compose (Optional)

If you have a `docker-compose.yml` file in your setup:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

For Podman users, install `podman-compose`:

```bash
sudo dnf install -y podman-compose
podman-compose up -d
```

## 🏭 Production Deployment

### Best Practices

When deploying DockMaster-RHEL to production, follow these guidelines:

#### 1. **Set NODE_ENV to production**

```bash
export NODE_ENV=production
npm run build
```

#### 2. **Use Multi-Stage Docker Builds**

Create a `Dockerfile` that separates build and runtime stages:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. **Use Minimal Base Images**

- Prefer `alpine` variants for smaller image sizes
- Remove development dependencies in production builds
- Use `.dockerignore` to exclude unnecessary files

#### 4. **Implement Health Checks**

Add health checks to your Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1
```

#### 5. **Run as Non-Root User**

```dockerfile
# In your Dockerfile
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
```

#### 6. **Externalize Secrets**

**Never** hardcode API keys or secrets in your Docker image. Use:

- Kubernetes Secrets
- Docker Secrets (Swarm mode)
- Environment variables injected at runtime
- Secret management services (HashiCorp Vault, AWS Secrets Manager)

```bash
# Example with Docker secrets
docker secret create gemini_api_key /path/to/secret/file
docker service create --secret gemini_api_key dockmaster-rhel:latest
```

#### 7. **Use a Reverse Proxy**

For production, place a reverse proxy (Nginx, Apache, Traefik) in front of your application:

- Handle SSL/TLS termination
- Implement rate limiting
- Add security headers
- Proxy API requests to hide keys from the frontend

Example Nginx reverse proxy configuration:

```nginx
server {
    listen 80;
    server_name dockmaster.example.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### RHEL-Specific: SELinux Considerations

RHEL enforces SELinux by default, which may affect container operations.

#### Check SELinux Status

```bash
sestatus
```

#### Common SELinux Issues and Solutions

**Issue**: Container cannot bind to ports

```bash
# Allow container to bind to specific port
sudo semanage port -a -t http_port_t -p tcp 8080
```

**Issue**: Container cannot access host volumes

```bash
# Label volumes with the correct SELinux context
docker run -v /host/path:/container/path:Z dockmaster-rhel:latest

# The :Z option tells Docker/Podman to relabel the volume
```

**Issue**: Podman permission denied

```bash
# Run in rootless mode (recommended)
podman run --userns=keep-id dockmaster-rhel:latest

# Or configure user namespace mapping
echo "yourusername:100000:65536" | sudo tee /etc/subuid /etc/subgid
```

#### Troubleshooting SELinux Issues

```bash
# View SELinux denials
sudo ausearch -m avc -ts recent

# Generate SELinux policy from denials
sudo ausearch -m avc -ts recent | audit2allow -M my-dockerapp
sudo semodule -i my-dockerapp.pp

# Temporarily set SELinux to permissive (not recommended for production)
sudo setenforce 0
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5173`

**Solution**:

```bash
# Find process using the port
lsof -i :5173
# Or on RHEL
sudo ss -tulpn | grep :5173

# Kill the process
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3000
```

#### Permission Denied (Docker/Podman)

**Error**: `permission denied while trying to connect to the Docker daemon socket`

**Solution**:

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# For Podman (rootless)
# No additional configuration needed, Podman runs rootless by default

# Re-login or run
newgrp docker
```

#### SELinux Blocking Container Access

**Error**: Container fails to start with permission errors on RHEL

**Solution**:

```bash
# Check SELinux logs
sudo ausearch -m avc -ts recent

# Add :Z flag to volumes for proper labeling
podman run -v /host/path:/container/path:Z dockmaster-rhel:latest

# Or temporarily disable SELinux (not recommended)
sudo setenforce 0
```

#### Build Failures

**Error**: `Module not found` or TypeScript errors

**Solution**:

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

#### API Key Not Working

**Error**: AI Tutor shows "API Key missing" message

**Solution**:

```bash
# For development: Use .env file or export
export API_KEY=your_actual_gemini_api_key
npm run dev

# For production build: Use VITE_ prefix
VITE_API_KEY=your_actual_gemini_api_key npm run build

# Verify API key is valid at https://aistudio.google.com/app/apikey
```

### Getting Help

- **Issues**: Report bugs at [GitHub Issues](https://github.com/J-Kibaki/DockMaster-RHEL/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/J-Kibaki/DockMaster-RHEL/discussions)
- **RHEL Documentation**: [Red Hat Container Tools](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/building_running_and_managing_containers/index)

## 📄 License

[License information to be added - please refer to the LICENSE file in this repository]

---

**Built with ❤️ for the RHEL community**
