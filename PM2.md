PM2 Command Guide for a Monorepo Project
This guide contains the essential PM2 commands for deploying and managing your multi-process NodeJS application on a server.

1. Starting Applications
   These commands are used to start your frontend and backend services using the scripts defined in your root package.json.

Start the Backend Service

pm2 start npm --name 16_module_b_backend -- run start:module-b:backend

pm2 start npm: Tells PM2 to start a process by running an npm script.

--name 16_module_b_backend: Assigns a clear, memorable name to the process.

-- run start:module-b:backend: The npm script from your package.json to execute. The -- is important to pass the arguments correctly to npm.

Start the Frontend Service

pm2 start npm --name 16_module_b_frontend -- run start:module-b:frontend

2. Viewing & Monitoring
   Once your apps are running, these commands are crucial for checking their status and debugging issues.

List All Running Processes
This command shows a table with the status, name, id, CPU usage, and memory usage of all applications managed by PM2.

pm2 list

Monitor Live Logs
This is the most important command for debugging. It streams the live console output (console.log, errors, etc.) from your application to your terminal.

# View logs for a specific application by name

pm2 logs 16_module_b_backend

# View logs for all applications at once

pm2 logs

(Press Ctrl+C to exit the log view.)

Show Detailed Information
This command gives you a detailed view of a specific application, including file paths, uptime, and more.

pm2 show 16_module_b_backend

3. Managing Running Processes
   These commands allow you to control your applications without removing them from the PM2 list.

Restart an Application
This stops and immediately starts an application. It's useful after you've uploaded new code.

pm2 restart 16_module_b_backend

Tip: pm2 restart all will restart every application in your list.

Stop an Application
This stops the application but keeps it in the PM2 list with a stopped status.

pm2 stop 16_module_b_backend

Tip: pm2 stop all will stop every application.

4. Managing the Process List
   These commands are for adding and removing applications from PM2's management list.

Delete an Application
This stops the application and completely removes it from the PM2 list.

pm2 delete 16_module_b_backend

Tip: pm2 delete all will clear every application from the list.

Save Your Process List
This is a critical command. It saves the current list of running applications so that PM2 will automatically restart them if the server ever reboots.

pm2 save

5. Managing the PM2 Daemon
   Kill the PM2 Daemon
   This command will shut down the main PM2 service and all applications it is managing. You will need to start your apps again after running this.

pm2 kill
