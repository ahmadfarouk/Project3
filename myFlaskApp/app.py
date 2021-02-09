from flask import Flask, jsonify, render_template
import pandas as pd
import datetime as dt
​
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func,inspect
from sqlalchemy import Integer, Column, Float, String
​
engine = create_engine("postgres://pgadmin@pg-srv-001:ucN-xZRL3NsaBjvG2tcw1gPcsNeS5Xfw@pg-srv-001.postgres.database.azure.com:5432/netflix",connect_args={'sslmode':'require'})
conn = engine.connect()
Base = automap_base()
Base.prepare(engine, reflect=True)
#print (Base.classes.keys())
​
title = Base.classes.title
country = Base.classes.country
listed_in = Base.classes.listed_in
players = Base.classes.players
pg_rating = Base.classes.pg_rating
director = Base.classes.director
title = Base.classes.title
title_country = Base.classes.title_country
country = Base.classes.country
​
session = Session(engine)
​
app = Flask(__name__)
@app.route("/")
def index():
    return render_template("index.html")
​
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
​
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
​
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
​
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
​
####x: Budget vs y: rating
​
​
####x: Budget vs y: Country
​
​
# 4. Define main behavior
​
if __name__ == "__main__":
    app.run(debug=True)