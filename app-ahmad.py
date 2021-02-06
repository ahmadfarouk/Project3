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
#        row["longitude"] = result2[3]
#        row["elevation"] = result2[4]
        allTitles.append(row)
    return jsonify(allTitles)

   
    app.run(debug=True)
# 4. Define main behavior
if __name__ == "__main__":