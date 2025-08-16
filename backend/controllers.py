from flask import Blueprint, jsonify, request
import math

transactions_bp = Blueprint('transactions', __name__)

class AnalyticsController:
    def __init__(self, transactions):
        self.transactions = transactions

    def get_transactions(self):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        category = request.args.get('category')
        region = request.args.get('region')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        filtered_data = self.transactions.copy()

        if category:
            filtered_data = [t for t in filtered_data if t['kategori'] == category]
        if region:
            filtered_data = [t for t in filtered_data if t['region'] == region]
        if start_date:
            filtered_data = [t for t in filtered_data if t['tanggal'] >= start_date]
        if end_date:
            filtered_data = [t for t in filtered_data if t['tanggal'] <= end_date]

        start = (page - 1) * per_page
        end = start + per_page
        paginated_data = filtered_data[start:end]

        return jsonify({
            'success': True,
            'data': paginated_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': len(filtered_data),
                'total_pages': math.ceil(len(filtered_data) / per_page)
            }
        })

def create_controllers_and_routes(transactions_data):
    analytics_controller = AnalyticsController(transactions_data)
    
    transactions_bp.add_url_rule('/', view_func=analytics_controller.get_transactions)
    
    return transactions_bp