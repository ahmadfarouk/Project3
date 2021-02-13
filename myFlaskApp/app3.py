from flask import Flask, jsonify, render_template
import pandas as pd
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func,inspect, desc
from sqlalchemy import Integer, Column, Float, String

engine = create_engine("postgres://pgadmin@pg-srv-001:ucN-xZRL3NsaBjvG2tcw1gPcsNeS5Xfw@pg-srv-001.postgres.database.azure.com:5432/netflix",connect_args={'sslmode':'require'})
conn = engine.connect()
Base = automap_base()
Base.prepare(engine, reflect=True)
#print (Base.classes.keys())

title = Base.classes.title
country = Base.classes.country
listed_in = Base.classes.listed_in
players = Base.classes.players
player_title = Base.classes.player_title
pg_rating = Base.classes.pg_rating
director = Base.classes.director
title = Base.classes.title
title_country = Base.classes.title_country
country = Base.classes.country
listed_in_title = Base.classes.listed_in_title
director_title = Base.classes.director_title

session = Session(engine)

app = Flask(__name__)
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/index3")
def index3():
    return render_template("index3.html")

####x: Listed In vs y: Count of titles
@app.route("/api/v1.0/listedin_count")
def listedin_count():
    listedin_count_all= []
    listedin_count = session.query (listed_in.listed_in_name, func.count(title.show_id)).filter(title.show_id == listed_in_title.show_id,).filter(listed_in.listed_in_id == listed_in_title.listed_in_id).group_by(listed_in.listed_in_name).order_by(desc(func.count(title.show_id))).limit(10)
    for result in listedin_count:
        row = {}
        row["Listed_in_name"] = result[0]
        row["Count"] = result[1]
        listedin_count_all.append(row)
    return jsonify(listedin_count_all)

# @app.route("/api/v1.0/titles_country")
# def titles_country():
#     titles_countries_years= []
#     countries_count = session.query (country.country_name, title.release_year, func.count(title.show_id)).filter(title.show_id==title_country.show_id,).filter(title_country.country_id == country.country_id).group_by(country.country_name, title.release_year).all()
#     for result in countries_count:
#         row = {}
#         row["country_name"] = result[0]
#         row["release_year"] = result[1]
#         row["Count_of_Titles"] = result[2]
#         titles_countries_years.append(row)
#     return jsonify(titles_countries_years)
# 4. Define main behavior

if __name__ == "__main__":
    app.run(debug=True)