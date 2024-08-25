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
        # app.logger.info('entre en post')
        longitude = request.form.get("longitude")
        if not latitude or not longitude:
            return jsonify({"error": "Missing latitude or longitude"}), 400
        wind = windavg(latitude,longitude)
        wind["Weibull"] = wind["Weibull"].tolist()
        wind["Weibull_direction"] = wind["Weibull_direction"].tolist()
        return jsonify({"weibull":wind["Weibull"],"weibull_direction":wind["Weibull_direction"], "direction":wind["wind_direction"], "speed":wind["wind_speed"]})

    else:
        app.logger.info('entre en get')
        return render_template("index.html")
    



@app.route("/solar", methods=["GET", "POST"])
def index2():

    if request.method =="POST":
        solar_power = request.form.get("solar_power")
        loss = request.form.get("loss")
        latitude = request.form.get("latitude")
        longitude = request.form.get("longitude")
        if not latitude or not longitude:
            return jsonify({"error": "Missing latitude or longitude"}), 400
        if not solar_power or not loss:
            return jsonify({"error": "Missing peak power or system loss"}), 400
        power_solar =power(latitude,longitude, solar_power, loss)
        return jsonify({"solar_production":power_solar["solar_production"], "slope":power_solar["slope"], "azimuth":power_solar["azimuth"]})

    else:
        app.logger.info('entre en get')
        return render_template("index.html")

