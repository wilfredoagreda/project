from flask import Flask, jsonify, render_template, request
from helpers import windavg, power

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

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
        longitude = request.form.get("longitude")
        if not latitude or not longitude:
            return jsonify({"error": "Missing latitude or longitude"}), 400
        wind = windavg(latitude,longitude)
        wind["Weibull"] = wind["Weibull"].tolist()
        wind["Weibull_direction"] = wind["Weibull_direction"].tolist()
        return jsonify({"weibull":wind["Weibull"],"weibull_direction":wind["Weibull_direction"], "direction":wind["wind_direction"], "speed":wind["wind_speed"]})

    else:
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
        return render_template("index.html")

