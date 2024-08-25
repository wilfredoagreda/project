# ECO SUSTAINABLE HOME
#### Video Demo:  <https://youtu.be/8yTaROlJjRQ>
#### Description:
The project is a website that help people make their homes eco-sustainable by installing wind turbines and solar panels. With the website users will be able to easily obtain the best configuration to be able to install wind turbines and solar panels in their homes to generate clean electric energy. It also has a consumption section where they will be able to know how much energy they consume in ways that will allow them to make their homes 100% self-sustainable, obtaining savings on their electric bill.

For the website a bootstrap template has been used, modifying aspects in CSS. The website is displayed through flask framework and python. JavaScript is also used, later on it is explained in depth where each one was used. The website is intended to be used in family homes so the calculations and models shown are for this type of cases, it is not designed for commercial and industrial purposes.

The web page consists of 5 steps, below the inputs and outputs of each are explained:

#### Step Nº1: Introduce your location
+ Input: Latitude, longitude
+ Output: Wind speed frequency distribution Weibull, direction distribution, average speed, average direction.
+ Files used and sequence:
1.  Click in maps screen in index.html.
2. Send information to index.js and call API from google maps getting latitud and longitude with functions Initmap()
and geocode().
3. Display latitude and longitude input fields html page. Send information with a form to flask in app.py.
4. In app.py call a function wind located in file helpers.py call an API from open-meteo getting data from 2022 of
wind speed and direction hourly.
5.  In helpers.py calculate distribution wind speed and direction Weibull, average speed and direction.
6. Return values to index.js and graph de distribution with canvas and display in index.html field.
+ Design choices: Latitude and longitude is not an easy to get by the user so I used a API from google maps to
facilitate this input. Latitude and longitude send it to app.py because the API from open-meteo is easy to get from
python, also there are several math operations with is more easily getting with python. Also I used javascript to
facilitate the make the grap with canvas.

### StepNº2: Calculate your consumption:
+ Input: Home appliances, nominal power, units, use per day (there are default values to facilitate the input).
+ Output: Consumption per day, consumption per year.
+ Files used and sequence:
1. Send information from input in index.html send to index.js.
2. With a math operation calculate the consumption per day and year and send it to index.html field.
Design choices: Calculation in this step is basic math operations so I decide using javascript to calculate the
consumption

### Step3: Select the model of your turbine
+ Input: select one of six models from radio buttons options in index.html
+ Output: Energy per year produce by turbine model.
+ Files used and sequence:
1. In index.js select the model selected with if statement and select the power data for that model (In index.js there
are one array for each model).
2. With the wind speed frequency obtained in step1 calculate the power of turbine per year.
3. Graph the power turbine with canvas and display in index.html, also display power turbine per year.
+ Design choices: I select the more important models in the market wind turbines, I used radio buttons to facilitate the
input. I used javascript because the math operations are very basic and also I can used canvas to display the graph.

### Step4: Complete the design with solar panels
+ Input: Installed peak PV power, system loss. (There are explanation how estimated this value to facilitate the input)
+ Output: Production per year, slope angle, azimuth angle.
+ Files used and sequence:
1. Send information to app.py with a form and call a function power located in helpers.py.
2. Call an API from PVGIS getting production per year, slope angle, azimuth angle.
3. Return values to index.js and graph de production per month with canvas and display in index.html field. Also
display production per year.
+ Design choices: I select python in this part I need to call an API in python with helpers.py file. I return the values to
javascript to display a graph with canvas.

### Step5: Calculate your savings
+ Input: price per kWh
+ Output: savings per year, energy saving reduction in %.
+ Files used and sequence:
1. Send information to index.js from input in index.html.
2. From production per year obtained in step 3 and 4 get the total production.
3. With an operation math get the savings with the input and with the consumption per year calculate reduction of
energy.
4. Display savings and reduction values in index.htm field.
Design choices: In this part is just simple operatons maths with the values obtained in steps before so I used
javascript to calculate an display the values.

Also there are a part of examples with pictures to help the user make an idea how would be your home if made
ecosustainable.

### Files in the project: 
+ static/images--> Pictures used in the project
+ static/bootstrap.min.css--> File frome bootstrap to design the page template
+ static/index.js Javascript file with the main functions used like: Initmap, clear, geocode: are functions to be used to call the API frome google maps to get the latitude and longitude.Function Initchart: function used to generate the graphics in canvas with the data obtained from flask. There are so many math operations to calculate consumption, power production and savings.
+ static/styles.css file in css to modify styles in the webpage.
+ template/index.html index page
+ app.py function in flask to receive the values from step one and four. There are functions like wind and power to be used to get the information from wheater API to obtained the values of wind and solar production.
+ helpers.py in this file are developed the functions wind and power where call the API from wheater Open-meteo and PVGIS site.

