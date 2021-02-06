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

#print (Base.classes.keys())
title = Base.classes.title
country = Base.classes.country
listed_in = Base.classes.listed_in
players = Base.classes.players
pg_rating = Base.classes.pg_rating
director = Base.classes.director

session = Session(engine)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index_ahmad.html")

@app.route("/api/v1.0/titles")
def titles():
    return jsonify(allStations)


   allTitles = []
    Titles = session.query(title.title,title.description,title.date_added).all()
    for result2 in Titles:
        row = {}
        row["title"] = result2[0]
        row["description"] = result2[1]
        row["date_added"] = result2[2]

    for result1 in Precipitation_12months:
        row = {}
        row["date"] = result1[0]
        row["prcp"] = result1[1]
        prcp_totals.append(row)

    Stations_all = session.query(Station.station,Station.name, Station.latitude,Station.longitude, Station.elevation).all()
    for result2 in Stations_all:
        row = {}
        row["station"] = result2[0]
        row["name"] = result2[1]
        row["latitude"] = result2[2]
        row["longitude"] = result2[3]
        row["elevation"] = result2[4]
        allStations.append(row)

    station_most_active_lastYear = session.query(Measurement.station, func.count(Measurement.tobs)).filter(Measurement.date > one_year_date).group_by(Measurement.station).order_by(func.count(Measurement.tobs).desc()).first()
    station_most_active_tobs = session.query(Measurement.station, Measurement.tobs)\
        .filter(Measurement.date > one_year_date).filter(Measurement.station == station_most_active_lastYear[0]).all()

    for result3 in station_most_active_tobs:
        row = {}
        row["station"] = result3[0]
        row["tobs"] = result3[1]
        tobs_station_most_active.append(row)

    app.run(debug=True)
# 4. Define main behavior
if __name__ == "__main__":