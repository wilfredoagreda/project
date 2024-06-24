import openmeteo_requests
import requests
import requests_cache
import pandas as pd
from retry_requests import retry
import urllib
import uuid

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
    #print(hourly_dataframe)
    avg=hourly_dataframe.mean()
    wind_speed_10m= round(float(avg.iloc[1]), 2)
    wind_speed_100m=round(float(avg.iloc[2]), 2)
    wind_direction_10m=round(float(avg.iloc[3]), 2)
    wind_direction_100m=round(float(avg.iloc[4]), 2)

    #print(avg)
    #print(avg.iloc[1])
    return {"wind_speed":wind_speed_10m, "wind_direction": wind_direction_10m}
