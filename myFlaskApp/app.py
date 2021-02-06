from flask import Flask, jsonify, render_template
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func,inspect
from sqlalchemy import Integer, Column, Float, String
import datetime as dt

engine = create_engine("postgres://pgadmin@pg-srv-001:ucN-xZRL3NsaBjvG2tcw1gPcsNeS5Xfw@pg-srv-001.postgres.database.azure.com:5432/netflix",connect_args={'sslmode':'require'})
conn=engine.connect()
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
    return render_template("index.html")

@app.route("/api/v1.0/titles")
def titles():
    allTitles = []
    Titles = session.query(title.title,title.description,title.date_added).all()
    for result2 in Titles:
        row = {}
        row["title"] = result2[0]
        row["description"] = result2[1]
        row["date_added"] = result2[2]
        #row["country"] = result2[3]
#         row["elevation"] = result2[4]
        allTitles.append(row)
    return jsonify(allTitles)


@app.route("/api/v1.0/countries")
def countries():
    allCountries = []
    Countries = session.query(country.country_id, country.country_name, country.longitude, country.latitude).all()
    
    for result3 in Countries:
        row = {}
        row["country_id"] = result3[0]
        row["country_name"] = result3[1]
        row["longitude"] = result3[2]
        row["latitude"] = result3[3]
       
#         row["elevation"] = result2[4]
        allCountries.append(row)
    return jsonify(allCountries)

# 4. Define main behavior
if __name__ == "__main__":
    app.run(debug=True)