ReadMe for the Financial Tracking App

Steps to Execute within Github:
1) Create you own branch for execution
2) In the Code dropdown button in the top right of the github repo, select codespaces
3) Create you own codespace if not created yet
4) Once the codespace is initialized, all of the needed packages should be installed and created, however if they are not, here is a list of everything that needs installed and ran to execute the program:
    npm install react react-dom
    npm install tailwindcss@next @tailwindcss/vite@6            //if the wrong version is installed, try ...@tailwindcss/vite@next
    npm install class-variance-authority clsx tailwind-merge
    npm install lucide-react
    npm install recharts
    npm install @radix-ui/react-dialog
    npm install @radix-ui/react-slot
    npm install @radix-ui/react-select
    npm install @radix-ui/react-separator
    npm install @radix-ui/react-progress
    npm install @radix-ui/react-alert-dialog
    npm install @radix-ui/react-label
    npm install sonner@2.0.3
    npm install date-fns
5) Once everything is installed, run the following commands:
    cd finanal-tracker
    npm run dev
6) A popup will appear in the bottom right corner saying a port has been opened with a button to "view in browser", click that
7) A new window will appear and after everything is loaded, you will see the app

Troubleshooting:
    Should any packages not be installed, codespace uses an AI agent that I found helpful in finding the missing packages and can even install them for you. The chat is on the right side of the codespace, you can use that to install any packages that might be missing.
