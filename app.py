import os
import matplotlib.pyplot as plt
import numpy as np
import math
import scipy.special as sc

from cs50 import sql
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from helpers import windavg, power

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure CS50 Library to use SQLite database
#db = SQL

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/", methods=["GET", "POST"])
def index():

    if request.method =="POST":
        latitude = request.form.get("latitude")
        app.logger.info('entre en post')
        longitude = request.form.get("longitude")
        solar_power = request.form.get("solar_power")
        loss = request.form.get("loss")
        if not latitude:
            return redirect("/")
        if not latitude:
            return redirect("/")
        if not solar_power:
            solar_power = 1
        if not loss:
            loss = 14

        wind = windavg(latitude,longitude)
        power_solar =power(latitude,longitude, solar_power, loss)

        # power_wind = power(wind, option)
        # print(wind)
        return render_template("index.html", weibull=wind["Weibull"],weibull_direction=wind["Weibull_direction"], latitude=latitude, longitude=longitude, direction=wind["wind_direction"], speed=wind["wind_speed"], solar_power=solar_power, loss=loss, solar_production=power_solar["solar_production"], slope=power_solar["slope"], azimuth=power_solar["azimuth"])

    else:
        app.logger.info('entre en get')
        return render_template("index.html")

