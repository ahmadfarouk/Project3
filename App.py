import os

from flask import  ( 
    Flask, 
    render_template,
    jsonify,
    request,
    redirect
)

from flask_sqlalchemy import flask_sqlalchemy