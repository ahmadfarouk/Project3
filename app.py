import os
from flask import Flask, jsonify
from sqlalchemy import create_engine, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

from flask import( 
    Flask, 
    render_template,
    jsonify,
    request,
    redirect)

import numpy as np
import pandas as pd
import datetime as dt


#from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

dictionary = {
    "ticker": "Amzn"

}

## FRONT_END ROUTES
@app.route("/")
def main():
    return render_template("index.html")


## SERVICE ROUTES
@app.route("/api/main/netflix")
def wel():
    
    return jsonify(dictionary)


# 4. Define main behavior
if __name__ == "__main__":
    app.run(debug=True)     