# Simple Identity and Access Management

A simple Identity and Access Management project for Crytography and Network Security's assignment.

## Clone the project
Open terminal and type
```bash
git clone https://github.com/tlqkhanh/Simple-Identity-and-Access-Management.git
cd 'Simple-Identity-and-Access-Management'
```

## Setup apache directory server
This is simple instruction to setup Apache Directory Server
- Download apache directory from link https://directory.apache.org/apacheds/downloads.html
- Click the .exe file has been downloaded and follow up the instructions.
- Open Service in MS Window and start Apache DS - default service.

## Setup apache directory studio
This is simple instruction to setup Apache Directory Studio
- Download apache directory studio from https://directory.apache.org/studio/downloads.html
- Click the setup.ext file has been downloaded and follow up the instructions.
- Open APS, on tools bar, click LDAP -> New Connection.
- Fill Connection Name with anything u want, I will fill it with APS. Hostname is localhost, port is 10389. After fill, click next.
- In the next window, choose Simple Authentication. The default Bind DN is "uid=admin,ou=system" and default Bind password is "secret". Next click Finish.
- Next, in the Connection windows in the left conner, right click to the DS server u just add and choose "Open Connection".
- In the folder u just cloned above, there is a .LDIF file, right click on "dc=example,dc=com" and choose import.
- Change the uid, mail, cn and sn of the "uid=example,ou=people" to what you want. Attention: **the username (part before @) of email and uid must be the same, and this will be the main admin account.**
- In each entry of "ou=group", change the uid in DN of the member attribute of each entry from "uid=example,ou=people,dc=example,dc=com" to what you have used in the above step.
## Setup mongodb
You can see various mongodb setup example out there so I won't say much about this.

## Set up server
First of all, open the folder contain the project u have cloned above, open terminal and type:
```bash
cd src/server
npm install
```
- Create a file name ".env" in server folder. Copy the content of the ".env.example" file to ".env" file and fill the value as I have comment.
- Attention: **you should create an app password so the service can u it to send email, I have given a link in the file, u can follow it**

## Set up client
First of all, open the folder contain the project u have cloned above, open terminal and type:
```bash
cd src/client
npm install
```
## Run the project
To run the project, you should have your apache directory server service open, mongoDB server service open.
In the root folder of the project, open 2 terminal, each type:
```bash
cd src
npm run server
```
```bash
cd src
npm run client
```