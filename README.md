# BrowserTest Pro

A comprehensive BrowserStack-like testing platform for web and Android applications built with Next.js, TypeScript, and Prisma.

## Features

### 🌐 Web Testing
- Test websites across different devices and browsers
- Real-time browser preview simulation
- Console logs and network request monitoring
- Screenshot capture and comparison tools

### 📱 Android App Testing
- Upload and test Android applications (APK/AAB files)
- Install apps on virtual Android devices
- Performance monitoring (CPU, memory, battery, network)
- Crash detection and reporting
- App-specific logs and debugging tools

### 🎛️ Session Management
- Create, start, stop, and manage test sessions
- Filter and search sessions by status, device, or content
- Detailed session information and metrics
- Separate interfaces for web and app sessions

### 🎨 User Interface
- Modern, responsive design using shadcn/ui components
- Mobile-first layout that works on all screen sizes
- Intuitive navigation with tabs and cards
- Real-time status indicators and progress feedback

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM, SQLite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks, custom API hooks
- **Database**: SQLite with Prisma

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shihan84/Tester.git
cd Tester
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
npm run prisma/seed/index.ts
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Web Testing
1. Navigate to the "Quick Test" tab
2. Enter a website URL
3. Select a device and browser combination
4. Click "Start Test Session" to begin testing

### Android App Testing
1. Navigate to the "App Test" tab
2. Upload your Android app (APK or AAB file)
3. Select a mobile device or tablet
4. Click "Start App Test Session" to begin testing

### Session Management
1. Go to the "Test History" tab
2. View all your test sessions
3. Use filters to find specific sessions
4. Start, stop, or delete sessions as needed

## Project Structure

```
src/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── devices/            # Device management
│   │   ├── browsers/           # Browser management  
│   │   ├── sessions/           # Session management
│   │   └── upload-app/         # App upload handling
│   ├── session/[id]/           # Web session interface
│   ├── app-session/[id]/       # App session interface
│   └── page.tsx               # Main dashboard
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── screenshot-gallery.tsx # Screenshot management
│   └── session-management.tsx # Session admin interface
├── hooks/
│   └── use-api.ts             # Custom API hooks
└── lib/
    ├── db.ts                  # Database connection
    └── utils.ts               # Utility functions
```

## API Endpoints

### Devices
- `GET /api/devices` - Get all devices
- `POST /api/devices` - Create a new device

### Browsers
- `GET /api/browsers` - Get all browsers
- `POST /api/browsers` - Create a new browser

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create a new session
- `GET /api/sessions/[id]` - Get session details
- `DELETE /api/sessions/[id]` - Delete a session
- `POST /api/sessions/[id]/start` - Start a session
- `POST /api/sessions/[id]/stop` - Stop a session
- `POST /api/sessions/[id]/screenshot` - Take screenshot
- `POST /api/sessions/[id]/install-app` - Install app

### App Upload
- `POST /api/upload-app` - Upload Android app

## Database Schema

The application uses the following main entities:
- **Users** - Application users
- **Devices** - Testing devices (desktop, mobile, tablet)
- **Browsers** - Web browsers
- **BrowserDevices** - Device-browser combinations
- **TestSessions** - Testing sessions
- **Screenshots** - Session screenshots
- **TestLogs** - Console and app logs
- **NetworkRequests** - Network request monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database managed with [Prisma](https://prisma.io/)
- Icons from [Lucide](https://lucide.dev/)

---

**Note**: This is a demonstration project inspired by BrowserStack. For production use, additional security measures, scalability considerations, and real device integration would be required.