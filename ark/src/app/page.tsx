// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">App Builder Platform</h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        Create web, mobile, and desktop applications with our intuitive drag-and-drop interface.
        No coding required!
      </p>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link 
          href="/editor" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Launch Editor
        </Link>
        
        <a 
          href="#features" 
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Learn More
        </a>
      </div>
      
      <div id="features" className="mt-20 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Platform Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Visual Editor</h3>
            <p>
              Build applications with an intuitive drag-and-drop interface. 
              No coding required.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Code Generation</h3>
            <p>
              Export clean, maintainable code for your projects in multiple languages 
              and frameworks.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Analytics Integration</h3>
            <p>
              Track user interactions and optimize your applications with integrated
              analytics and insights.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Mobile Support</h3>
            <p>
              Generate mobile applications for iOS and Android from a single codebase.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Desktop Applications</h3>
            <p>
              Create cross-platform desktop applications for Windows, macOS, and Linux.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Component Library</h3>
            <p>
              Access a growing library of pre-built components to speed up your development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}