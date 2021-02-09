from flask import Flask, jsonify, render_template
import pandas as pd
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func,inspect
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

####Country vs y: Count of Titles, drop down: Year ----done
@app.route("/api/v1.0/titles_country")
def titles_country():
    titles_countries_years= []
    countries_count = session.query (country.country_name, title.release_year, func.count(title.show_id)).filter(title.show_id==title_country.show_id,).filter(title_country.country_id == country.country_id).group_by(country.country_name, title.release_year).all()
    for result4 in countries_count:
        row = {}
        row["country_name"] = result4[0]
        row["release_year"] = result4[1]
        row["Count_of_Titles"] = result4[2]
        titles_countries_years.append(row)
    return jsonify(titles_countries_years)

####x: Budget vs y: Movie Revenue 
@app.route("/api/v1.0/budget_revenue")
def budget_revenue():
    budget_revenue_all= []
    budget_revenue = session.query (title.budget, title.revenue).filter(title.budget!=0,).filter(title.revenue != 0).all()
    for result5 in budget_revenue:
        row = {}
        row["Budget"] = result5[0]
        row["Revenue"] = result5[1]
        budget_revenue_all.append(row)
    return jsonify(budget_revenue_all)

####x: Budget vs y: rating
@app.route("/api/v1.0/pgrating_totalbudget")
def pgrating_totalbudget():
    pgrating_totalbudget_all= []
    pgrating_totalbudget = session.query (pg_rating.pg_rating_name, func.sum(title.budget)).filter(title.pg_rating_id==pg_rating.pg_rating_id).group_by(pg_rating.pg_rating_name).all()
    for result6 in pgrating_totalbudget:
        row = {}
        row["PG_Rating"] = result6[0]
        row["Total_budget"] = result6[1]
        pgrating_totalbudget_all.append(row)
    return jsonify(pgrating_totalbudget_all)

####x: Budget vs y: Country
@app.route("/api/v1.0/country_budget")
def country_budget():
    country_budget_all= []
    country_budget = session.query (country.country_name, func.sum(title.budget)).filter(title.show_id == title_country.show_id,).filter(title_country.country_id == country.country_id).group_by(country.country_name).all()
    for result7 in country_budget:
        row = {}
        row["country_name"] = result7[0]
        row["budget"] = result7[1]
        country_budget_all.append(row)
    return jsonify(country_budget_all)

####x: Listed In vs y: Count of titles
@app.route("/api/v1.0/listedin_count")
def listedin_count():
    listedin_count_all= []
    listedin_count = session.query (listed_in.listed_in_name, func.count(title.show_id)).filter(title.show_id == listed_in_title.show_id,).filter(listed_in.listed_in_id == listed_in_title.listed_in_id).group_by(listed_in.listed_in_name).all()
    for result8 in listedin_count:
        row = {}
        row["Listed_in_name"] = result8[0]
        row["Count"] = result8[1]
        listedin_count_all.append(row)
    return jsonify(listedin_count_all)

####x: Directors vs Count
@app.route("/api/v1.0/directors_count")
def directors_count():
    directors_count_all= []
    directors_count = session.query (director.director_name, func.count(title.show_id)).filter(director.director_id == director_title.director_id,).filter(title.show_id == director_title.show_id).group_by(director.director_name).all()
    for result9 in directors_count:
        row = {}
        row["director_name"] = result9[0]
        row["Count"] = result9[1]
        directors_count_all.append(row)
    return jsonify(directors_count_all)


# 4. Define main behavior

if __name__ == "__main__":
    app.run(debug=True)