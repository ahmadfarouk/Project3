from flask import Flask, jsonify, render_template
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func,inspect
from sqlalchemy import Integer, Column, Float, String
import datetime as dt

engine = create_engine("sqlite:///Resources/hawaii.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)
Measurement = Base.classes.measurement
Station = Base.classes.station

session = Session(engine)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index_ahmad.html")

@app.route("/api/v1.0/stations")
def stations():
    allStations = []
    Stations_all = session.query(Station.station,Station.name, Station.latitude,Station.longitude, Station.elevation).all()
    for result2 in Stations_all:
        row = {}
        row["station"] = result2[0]
        row["name"] = result2[1]
        row["latitude"] = result2[2]
        row["longitude"] = result2[3]
        row["elevation"] = result2[4]
        allStations.append(row)
    return jsonify(allStations)

# 4. Define main behavior
if __name__ == "__main__":
    app.run(debug=True)
