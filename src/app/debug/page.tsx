import { ApkUploadDebugger } from '@/components/apk-upload-debugger'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Debug Tools</h1>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        <ApkUploadDebugger />
      </main>
    </div>
  )
}