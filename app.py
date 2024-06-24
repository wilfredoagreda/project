import os

from cs50 import sql
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from helpers import windavg

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
        wind = windavg(latitude,longitude)
        print(wind)
        return render_template("index.html", direction=wind["wind_direction"], speed=wind["wind_speed"])

    else:
        # app.logger.info('entre en get')
        return render_template("index.html")
