from flask import Blueprint, jsonify, request
import math
from datetime import datetime, timedelta


transactions_bp = Blueprint('transactions', __name__)
analytics_bp = Blueprint('analytics', __name__)


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
            filtered_data = [
                t for t in filtered_data if t['kategori'] == category]
        if region:
            filtered_data = [t for t in filtered_data if t['region'] == region]
        if start_date:
            filtered_data = [
                t for t in filtered_data if t['tanggal'] >= start_date]
        if end_date:
            filtered_data = [
                t for t in filtered_data if t['tanggal'] <= end_date]

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

    def get_analytics_overview(self):
        today = datetime.now()
        current_month_start = today.replace(day=1)
        previous_month_start = (current_month_start -
                                timedelta(days=1)).replace(day=1)

        current_month_data = [t for t in self.transactions if t['tanggal']
                              >= current_month_start.strftime('%Y-%m-%d')]
        previous_month_data = [t for t in self.transactions
                               if previous_month_start.strftime('%Y-%m-%d') <= t['tanggal'] < current_month_start.strftime('%Y-%m-%d')]

        def calculate_metrics(dataset):
            if not dataset:
                return {'revenue': 0, 'orders': 0, 'customers': 0, 'avg_order': 0, 'return_rate': 0}

            revenue = sum(t['total_penjualan'] - t['discount']
                          for t in dataset)
            orders = len(dataset)
            customers = len(set(t['id'] % 1000 for t in dataset))
            avg_order = revenue / orders if orders > 0 else 0
            return_rate = sum(
                1 for t in dataset if t['is_returned']) / orders * 100 if orders > 0 else 0

            return {
                'revenue': revenue,
                'orders': orders,
                'customers': customers,
                'avg_order': avg_order,
                'return_rate': return_rate
            }

        def calculate_growth(current, previous):
            if previous == 0:
                return 100 if current > 0 else 0
            return ((current - previous) / previous) * 100

        current_metrics = calculate_metrics(current_month_data)
        previous_metrics = calculate_metrics(previous_month_data)

        return jsonify({
            'success': True,
            'data': {
                'current_period': current_metrics,
                'previous_period': previous_metrics,
                'growth': {
                    'revenue': round(calculate_growth(current_metrics['revenue'], previous_metrics['revenue']), 2),
                    'orders': round(calculate_growth(current_metrics['orders'], previous_metrics['orders']), 2),
                    'customers': round(calculate_growth(current_metrics['customers'], previous_metrics['customers']), 2),
                    'avg_order': round(calculate_growth(current_metrics['avg_order'], previous_metrics['avg_order']), 2),
                    'return_rate': round(current_metrics['return_rate'] - previous_metrics['return_rate'], 2)
                }
            }
        })


def create_controllers_and_routes(transactions_data):
    analytics_controller = AnalyticsController(transactions_data)

    transactions_bp.add_url_rule(
        '/', view_func=analytics_controller.get_transactions)
    analytics_bp.add_url_rule(
        '/overview', view_func=analytics_controller.get_analytics_overview)

    return transactions_bp, analytics_bp
