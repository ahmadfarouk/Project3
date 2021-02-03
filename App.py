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