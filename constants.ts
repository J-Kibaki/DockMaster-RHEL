import { Module, Difficulty } from './types';

export const ROADMAP: Module[] = [
  {
    id: 'm1',
    title: 'Module 1: Foundations',
    description: 'Understanding the container revolution and RHEL setup.',
    difficulty: Difficulty.BEGINNER,
    lessons: [
      {
        id: 'l1-1',
        title: 'Virtualization vs. Containerization',
        content: `Before we type commands, we must understand **what** we are building.

### The Old Way: Virtual Machines (VMs)
Imagine a house (Physical Server). To let multiple families (Apps) live there, you built separate guest houses (VMs) inside. Each guest house had its own plumbing, electricity, and heating (Guest OS).
*   **Pros**: Complete isolation.
*   **Cons**: Heavy, slow to start, wastes resources.

### The New Way: Containers
Imagine an Apartment Complex. Everyone shares the same foundation, plumbing, and electricity (Host OS Kernel), but each apartment (Container) is locked and private.
*   **Pros**: Lightweight, starts in milliseconds, efficient.
*   **Cons**: Shared kernel (less isolation than VMs).

### Why RHEL9?
RHEL9 is the "Foundation" of our apartment complex. It provides the **Kernel** that all containers share. It is known for stability and security (SELinux), making it the perfect landlord.`,
        rhelNotes: "RHEL9 uses the **Linux Kernel 5.14**. All containers running on this machine will share this exact kernel version.",
        exercises: [
          {
            id: 'e1-1',
            question: "In the apartment analogy, what represents the Host OS Kernel that containers share?",
            expectedCommand: "plumbing", 
            hint: "It's the shared infrastructure like plumbing or electricity."
          }
        ]
      },
      {
        id: 'l1-2',
        title: 'Installation on RHEL9',
        content: `RHEL9 defaults to **Podman**, a Red Hat tool. To use **Docker**, we must configure it manually.

### Step 1: Remove Conflicts
RHEL might have Podman or Buildah pre-installed.
\`\`\`bash
sudo dnf remove -y podman buildah
\`\`\`

### Step 2: Add Docker Repo
We point \`dnf\` to the official Docker source.
\`\`\`bash
sudo dnf install -y yum-utils
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
\`\`\`

### Step 3: Install
\`\`\`bash
sudo dnf install -y docker-ce docker-ce-cli containerd.io
\`\`\`

### Step 4: Start & Enable
Start the daemon now and ensure it starts on reboot.
\`\`\`bash
sudo systemctl enable --now docker
\`\`\`
`,
        rhelNotes: "If you see `package podman-docker conflicts with docker-ce`, it means you didn't remove the `podman-docker` wrapper package. Run `dnf remove podman-docker`.",
        exercises: [
          {
            id: 'e1-2',
            question: "Which systemctl command flag ensures the service starts immediately AND after every reboot?",
            expectedCommand: "systemctl enable --now docker",
            hint: "It combines 'enable' and 'start'. It is --now."
          }
        ]
      }
    ]
  },
  {
    id: 'm2',
    title: 'Module 2: CLI Mastery',
    description: 'Daily driver commands for managing containers.',
    difficulty: Difficulty.BEGINNER,
    lessons: [
      {
        id: 'l2-1',
        title: 'Lifecycle: Run, Stop, Remove',
        content: `Let's manage the lifecycle of a container.

### 1. Run (Create & Start)
\`\`\`bash
docker run -d --name my-web nginx
\`\`\`
*   \`-d\`: Detached (background).
*   \`--name\`: Friendly name.

### 2. List (Process Status)
See what's running.
\`\`\`bash
docker ps
\`\`\`
Add \`-a\` to see stopped containers too.

### 3. Stop (Graceful Halt)
\`\`\`bash
docker stop my-web
\`\`\`

### 4. Remove (Clean up)
You cannot remove a running container (usually). Stop it first.
\`\`\`bash
docker rm my-web
\`\`\`
`,
        rhelNotes: "Commands work the same on RHEL. However, remember that `docker` commands need `sudo` unless you add your user to the `docker` group: `sudo usermod -aG docker $USER`.",
        exercises: [
          {
            id: 'e2-1',
            question: "What flag allows you to view stopped containers in the list?",
            expectedCommand: "-a",
            hint: "It stands for 'all'."
          }
        ]
      },
      {
        id: 'l2-2',
        title: 'Interacting: Exec & Logs',
        content: `Sometimes a container runs, but the app inside is broken. We need to debug.

### Seeing Logs
View the "console output" of the application inside the container.
\`\`\`bash
docker logs -f my-web
\`\`\`
*   \`-f\`: Follow (stream updates).

### Entering the Container
To open a shell *inside* the container (like SSHing into it):
\`\`\`bash
docker exec -it my-web bash
\`\`\`
*   \`-i\`: Interactive (keep input open).
*   \`-t\`: TTY (allocate a pseudo-terminal).
*   \`bash\`: The command to run (shell).
`,
        rhelNotes: "Some minimal containers (like `alpine`) don't have `bash`. Use `sh` instead: `docker exec -it my-web sh`.",
        exercises: [
          {
            id: 'e2-2',
            question: "Construct the command to start an interactive bash shell inside a container named 'db_server'.",
            expectedCommand: "docker exec -it db_server bash",
            hint: "Use docker exec with -it flags."
          }
        ]
      }
    ]
  },
  {
    id: 'm3',
    title: 'Module 3: Images & Builds',
    description: 'From consumer to creator: Building Docker images.',
    difficulty: Difficulty.INTERMEDIATE,
    lessons: [
      {
        id: 'l3-1',
        title: 'The Dockerfile',
        content: `A **Dockerfile** is a recipe text file. Docker reads it to bake an Image.

### Core Instructions
*   \`FROM\`: The base layer (OS or runtime). e.g., \`FROM redhat/ubi9-minimal\`.
*   \`RUN\`: Execute commands during build. e.g., \`RUN dnf install -y python3\`.
*   \`COPY\`: Copy files from host to image. e.g., \`COPY app.py /src/\`.
*   \`CMD\`: The command that runs when the container starts. e.g., \`CMD ["python3", "/src/app.py"]\`.

### Example
\`\`\`dockerfile
FROM nginx:latest
COPY index.html /usr/share/nginx/html/
\`\`\`
This creates a custom web server with your HTML file inside.
`,
        rhelNotes: "Red Hat provides **UBI (Universal Base Images)**. These are secure, RHEL-based images free to use. Prefer `FROM registry.access.redhat.com/ubi9/ubi` over `FROM centos`.",
        exercises: [
          {
            id: 'e3-1',
            question: "Which Dockerfile instruction is used to execute a command *during the build process* (installing packages, etc.)?",
            expectedCommand: "RUN",
            hint: "It runs commands."
          }
        ]
      },
      {
        id: 'l3-2',
        title: 'Building & Tagging',
        content: `Once you have a Dockerfile, you build the image.

### Build Command
\`\`\`bash
docker build -t my-app:v1 .
\`\`\`
*   \`-t my-app:v1\`: Tag the image with a name and version.
*   \`.\`: Look for Dockerfile in the current directory.

### Managing Images
List your images:
\`\`\`bash
docker images
\`\`\`
Remove an image:
\`\`\`bash
docker rmi my-app:v1
\`\`\`
`,
        rhelNotes: "RHEL's disk space is often partitioned. Docker images live in `/var/lib/docker`. Ensure your `/var` partition has space!",
        exercises: [
          {
            id: 'e3-2',
            question: "Command to build an image from the current directory and tag it as 'webapp:1.0'.",
            expectedCommand: "docker build -t webapp:1.0 .",
            hint: "Use docker build -t ..."
          }
        ]
      }
    ]
  },
  {
    id: 'm4',
    title: 'Module 4: Storage & Data',
    description: 'Handling persistent data in RHEL environments.',
    difficulty: Difficulty.INTERMEDIATE,
    lessons: [
      {
        id: 'l4-1',
        title: 'Bind Mounts & The SELinux Trap',
        content: `Containers are transient. If you restart one, files created inside remain. If you **delete** one, files are gone.

### Bind Mounts
Link a host folder to a container folder.
\`\`\`bash
docker run -v /host/data:/container/data nginx
\`\`\`

### The RHEL Problem
RHEL enables **SELinux** (Security Enhanced Linux). It acts like a strict bouncer. It sees the container trying to access \`/host/data\` and says "Access Denied" because the security labels don't match.

### The Fix: :Z
Appeding \`:Z\` tells Docker: "Please relabel this host directory so the container is allowed to touch it."
\`\`\`bash
docker run -v /host/data:/container/data:Z nginx
\`\`\`
`,
        rhelNotes: "**Warning**: Using `:Z` changes labels on your host files. Do not do this on system directories like `/usr` or `/etc` or you might break the host OS!",
        exercises: [
          {
            id: 'e4-1',
            question: "What suffix must be added to a bind mount path in RHEL to automatically handle SELinux relabeling?",
            expectedCommand: ":Z",
            hint: "It is a capital letter Z."
          }
        ]
      }
    ]
  },
  {
    id: 'm5',
    title: 'Module 5: Docker Compose',
    description: 'Orchestrating multi-container applications.',
    difficulty: Difficulty.PRO,
    lessons: [
      {
        id: 'l5-1',
        title: 'Defining Services',
        content: `Running 5 containers with 5 long \`docker run\` commands is painful. **Docker Compose** lets you define an entire infrastructure in one file: \`docker-compose.yml\`.

### Structure
\`\`\`yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
  database:
    image: postgres
    environment:
      POSTGRES_PASSWORD: secret
\`\`\`

### Running it
\`\`\`bash
docker compose up -d
\`\`\`
Docker creates a dedicated network, starts both services, and connects them.
`,
        rhelNotes: "On RHEL9, you might need to install the plugin separately: `sudo dnf install docker-compose-plugin`.",
        exercises: [
          {
            id: 'e5-1',
            question: "What single command starts all services defined in your compose file in the background?",
            expectedCommand: "docker compose up -d",
            hint: "Use 'up' with the detached flag."
          }
        ]
      }
    ]
  },
  {
    id: 'm6',
    title: 'Module 6: Orchestration',
    description: 'Advanced Docker orchestration with Kubernetes concepts.',
    difficulty: Difficulty.PRO,
    lessons: [
      {
        id: 'l6-1',
        title: 'Introduction to Orchestration',
        content: `When you have hundreds of containers across dozens of servers, \`docker run\` and \`docker-compose\` aren't enough. You need an **Orchestrator**.

### What is Orchestration?
It is the automated configuration, coordination, and management of computer systems and software.
*   **Scheduling**: Deciding which server hosts which container.
*   **Healing**: Restarting failed containers automatically.
*   **Scaling**: Increasing container counts during high traffic.

### The Standard: Kubernetes (K8s)
Kubernetes has won the orchestration war. It abstracts the hardware infrastructure, allowing you to treat a cluster of servers as a single computer.`,
        rhelNotes: "Red Hat's Enterprise Kubernetes solution is **OpenShift**. It is built on top of RHEL and standard Kubernetes, adding developer tools and stricter security defaults.",
        exercises: [
          {
            id: 'e6-1',
            question: "What is the primary function of an orchestrator regarding failed containers?",
            expectedCommand: "healing",
            hint: "It starts with H. It involves restarting them automatically."
          }
        ]
      },
      {
        id: 'l6-2',
        title: 'Basic Pods and Deployments',
        content: `In the orchestration world, we don't just run "containers". We run **Pods**.

### The Pod
A Pod is a wrapper around one or more containers.
*   Containers in a Pod share the same IP address.
*   They share the same storage volumes.
*   They live and die together.

### The Deployment
You rarely create a Pod directly. You create a **Deployment**.
A Deployment says: "Ensure 3 copies (replicas) of the Nginx Pod are always running."

### RHEL & Podman Integration
Uniquely, RHEL's Podman can interact with Kubernetes definitions.
\`\`\`bash
# Generate K8s YAML from a running container
podman generate kube my-container > pod.yaml

# Run a K8s YAML locally without a cluster!
podman play kube pod.yaml
\`\`\`
`,
        rhelNotes: "`podman play kube` is a powerful feature in RHEL9. It allows developers to use production Kubernetes YAML files on their local laptops without the overhead of running Minikube or Kind.",
        exercises: [
          {
            id: 'e6-2',
            question: "Which Podman command allows you to execute a Kubernetes YAML file locally?",
            expectedCommand: "podman play kube",
            hint: "It involves 'playing' the kube file."
          }
        ]
      }
    ]
  }
];