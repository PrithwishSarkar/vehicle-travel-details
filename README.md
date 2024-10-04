# Vehicle Travel Details
 
![Application screenshot](./public/images/Img01.png)
<br/>

![Application screenshot](./public/images/Img02.png)
<br/>

![Application screenshot](./public/images/Img03.png)
<br/>

![Application screenshot](./public/images/Img04.png)
<br/>

<br/>

With this application user can insert a .csv file containing GPS data for a vehicle, and view the path on the map and also trip details like speed, duration, distance and so on.
<br/>
The app is developed using `React.js` and `Chakra UI` for Front-end, `Node.js` and `Express.js` for Backend, and `MongoDB` as Database.

## Please Note (Important) :

- Use email: `user1@example.com` and Password: `User@001`. The credentials are hardcoded for a single user.
- The backend is hosted on a free service, so there might be a delay while opening the site for the first time. Please wait for it to load.

<br/>

## 💻 Live Demo:

[https://vehicle-travel-details.vercel.app](https://vehicle-travel-details.vercel.app)

<br/> 

## ✨ Getting Started

- Make sure you already have `Node.js` and `npm` installed in your system.
- You need an API key from [OpenCage](https://opencagedata.com). After creating an account, [grab your key](https://opencagedata.com/users/sign_up).

<br/>

## ⚡ Install

- Clone the repository:

```bash
git clone https://github.com/PrithwishSarkar/my-weather-app.git

```

- Install the packages in both front-end and Back-end using the command `npm install`
- In the backend directory, make a .env file with key: DB_URI, and value: your database URL; key: OPENCAGE_API_KEY, value: your api key; and key: PORT, and value: your port value(except 3000).
- Start the backend development server using the command `nodemon app.js`
- In the frontend directory, make a .env file with key REACT_APP_SERVER_URL, and value: your server URL, followed by "/trips/66f824b92c7497f60f0d47b1".
- Start the frontend development server using the command `npm start`
- You can view the website at [Localhost](https://localhost:3000)

<br/>

## 📙 Used libraries

- `react-js`
- `Chakra UI`

Check `packages.json` for details

<br/>

## 📄 Details

- [ ] The database has three collection: `Trips`, mapped to the collection `Vehicles`, which is again mapped to `Users`
- [ ] The pages cannot be accessed without login. If you try to enter URL of a page to view it, the site redirects to the login page.
- [ ] Used session storage to reduce number of API calls.
- [ ] When all the trips are ddeleted, the site shows the initial upload page.
- [ ] Provision to select all trips at once is not present in mobile view.
- [ ] The map is centered at the starting point.
- [ ] Several edge cases have been handles. See the code for details.

<br/>
Thank You 😊
