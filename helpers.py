import openmeteo_requests
import requests
import requests_cache
import pandas as pd
from retry_requests import retry
import urllib
import uuid
import os, csv, json, requests
import glob
from datetime import date
for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        print(os.path.join(dirname, filename))
import matplotlib.pyplot as plt
import numpy as np
import math
import scipy.special as sc

from flask import redirect, render_template, request, session
from functools import wraps

def windavg(longitude, latitude):
    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache', expire_after = -1)
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)

    # Make sure all required weather variables are listed here
    # The order of variables in hourly or daily is important to assign them correctly below
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": "2022-01-01",
        "end_date": "2022-12-31",
        "hourly": ["wind_speed_10m", "wind_speed_100m", "wind_direction_10m", "wind_direction_100m"],
        "wind_speed_unit": "ms"
    }
    responses = openmeteo.weather_api(url, params=params)

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]
    #print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
    #print(f"Elevation {response.Elevation()} m asl")
    #print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
    #print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

    # Process hourly data. The order of variables needs to be the same as requested.
    hourly = response.Hourly()
    hourly_wind_speed_10m = hourly.Variables(0).ValuesAsNumpy()
    hourly_wind_speed_100m = hourly.Variables(1).ValuesAsNumpy()
    hourly_wind_direction_10m = hourly.Variables(2).ValuesAsNumpy()
    hourly_wind_direction_100m = hourly.Variables(3).ValuesAsNumpy()

    hourly_data = {"date": pd.date_range(
        start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
        end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
        freq = pd.Timedelta(seconds = hourly.Interval()),
        inclusive = "left"
    )}
    hourly_data["wind_speed_10m"] = hourly_wind_speed_10m
    hourly_data["wind_speed_100m"] = hourly_wind_speed_100m
    hourly_data["wind_direction_10m"] = hourly_wind_direction_10m
    hourly_data["wind_direction_100m"] = hourly_wind_direction_100m

    hourly_dataframe = pd.DataFrame(data = hourly_data)
    # print(hourly_dataframe)
    avg=hourly_dataframe.mean()
    wind_speed_10m= round(float(avg.iloc[1]), 2)
    wind_speed_100m=round(float(avg.iloc[2]), 2)
    wind_direction_10m=round(float(avg.iloc[3]), 2)
    wind_direction_100m=round(float(avg.iloc[4]), 2)

    def weibull (x,c,k):
     return (k / c) * (x / c)**(k - 1) * np.exp(-(x / c)**k)

    ws = hourly_data["wind_speed_10m"]
    r1, r2 = 0, 20
    def vel(r1, r2):
        return [item for item in range(r1, r2+1)]
    speed = vel(r1,r2)


    direct = [0, 30, 60, 90, 120, 150, 180, 210, 240, 300, 330, 360]
    wsd = hourly_data["wind_direction_10m"]
        
    #calculate k
    k= (math.sqrt(np.mean(abs(ws - np.mean(ws))**2))/np.mean(ws))**-1.089

    #calculate c
    gamma_f = math.exp(sc.gammaln(1+(1/k)))
    c = (np.mean(ws)/gamma_f)
  
    Weibull = weibull(speed,c,k)
    Weibull_df = Weibull
    # print(Weibull_df)

        #calculate k
    kd= (math.sqrt(np.mean(abs(wsd - np.mean(wsd))**2))/np.mean(wsd))**-1.089

    #calculate c
    gamma_ff = math.exp(sc.gammaln(1+(1/kd)))
    cd = (np.mean(wsd)/gamma_ff)
  
    Weibull_direction = weibull(direct,cd,kd)
    Weibull_dff = Weibull_direction
    # print(Weibull_df)

    return {"hourly_data_wind":hourly_dataframe["wind_speed_10m"],"hourly_data_direction":hourly_dataframe["wind_direction_10m"], "Weibull":Weibull_df, "Weibull_direction":Weibull_dff, "wind_speed":wind_speed_10m, "wind_direction": wind_direction_10m}

def power(lat, lon, solar_power, loss):

    # -----------Set up array with lat - long values ------------------------------ 
    # -----------WGS84 format if not alreaady--------------------------------------
 
    # csv_list=[f for f in glob.glob(os.path.join(r'Q:\projects\csv_fpr pvgis', "*.csv"))] #list of csv to check
    #-----------------PVGIS create URLs----------------------------------                   
    url_base = f"https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?"

    #----- set API call parameters (examples below) ------------------
    pvgis_params = dict(
    lat = lat,
    lon = lon,
    peakpower=solar_power,
    loss=loss,
    optimalinclination=1,
    vertical_axis=1,
    optimalangles=1,
    inclined_axis=1,
    inclined_optimum=1,
    angle = 0,
    azimuth = 0,
    outputformat = 'json',)

    params = "&".join([f'{key}={value}' for key, value in pvgis_params.items()])
    url_pvcalc = f'{url_base}&{params}'

    response = requests.get(url_pvcalc)
    row_json = json.loads(response.text)
    e_m_value = [entry["E_m"] for entry in row_json["outputs"]["monthly"]["fixed"]]
    slope = row_json["inputs"]["mounting_system"]["fixed"]["slope"]["value"]
    azimuth = row_json["inputs"]["mounting_system"]["fixed"]["azimuth"]["value"]

    # print(e_m_value)
   
    return {"solar_production":e_m_value, "slope":slope, "azimuth":azimuth}



