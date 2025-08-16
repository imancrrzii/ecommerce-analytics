from controllers import create_controllers_and_routes

def register_routes(app, transactions_data):
    transactions_bp = create_controllers_and_routes(transactions_data)
    
    app.register_blueprint(transactions_bp, url_prefix='/api/v1/transactions')