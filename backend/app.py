from flask import Flask
from flask_cors import CORS
from data_generator import ECommerceDataGenerator
from routes import register_routes

app = Flask(__name__)
CORS(app)

data_generator = ECommerceDataGenerator()
transactions = data_generator.generate_transactions(count=1000)

register_routes(app, transactions)

if __name__ == '__main__':
    app.run(debug=True, port=5001)