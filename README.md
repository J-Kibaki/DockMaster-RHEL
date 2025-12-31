# DockMaster RHEL 🐳

**The ultimate interactive platform for mastering Docker in Red Hat Enterprise Linux 9 environments.**

DockMaster RHEL bridges the gap between generic Docker tutorials and the specific requirements of enterprise RHEL systems. Learn to navigate SELinux policies, Podman interoperability, and secure container practices through interactive simulation.

## 🌟 Key Features

- **Interactive Terminal**: Real-time command validation with simulation of RHEL 9 behavior.
- **RHEL-Specific Curriculum**: Learn about `ubi9` images, SELinux contexts (`:Z`), and systemd integration.
- **AI Tutor (Gemini)**: Context-aware AI assistance that understands the specific lesson you are working on.
- **Progress Tracking**: Visual roadmap with module completion status and local persistence.
- **Modern UI**: Built with React, TailwindCSS, and Lucide Icons for a clean, dark-mode experience.

## 📚 Learning Path

The application currently supports the following modules:

1. **Foundations**: Virtualization vs Containerization, RHEL Setup.
2. **CLI Mastery**: Essential Docker commands.
3. **Images & Builds**: Dockerfiles and UBI.
4. **Storage & Data**: Bind mounts and SELinux.
5. **Docker Compose**: Multi-container apps.
6. **Orchestration**: Introduction to Kubernetes and Podman.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google GenAI SDK (Gemini 3.0 Flash Preview)
- **State Management**: React Hooks

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dockmaster-rhel.git
   cd dockmaster-rhel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment**
   Create a `.env` file in the root directory and add your Google Gemini API key (optional, for AI features):
   ```bash
   VITE_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🐳 Docker Support

To run DockMaster itself in a container:

```bash
docker build -t dockmaster-rhel .
docker run -d -p 8080:80 dockmaster-rhel
```

## 📝 License

This project is licensed under the MIT License.