from flask import Blueprint, jsonify, request
import math
from collections import defaultdict
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

    def get_revenue_trend(self):
        period = request.args.get('period', 'monthly')
        
        trend_data = defaultdict(lambda: {
            'revenue': 0, 'orders': 0, 'profit': 0, 'returns': 0,
            'new_customers': 0, 'returning_customers': 0
        })
        
        for transaction in self.transactions:
            if period == 'monthly':
                key = transaction['tanggal'][:7]
            elif period == 'weekly':
                date_obj = datetime.strptime(transaction['tanggal'], '%Y-%m-%d')
                week = date_obj.isocalendar()[1]
                key = f"{date_obj.year}-W{week:02d}"
            else:
                key = transaction['tanggal']
            
            net_revenue = transaction['total_penjualan'] - transaction['discount']
            profit = net_revenue - transaction['shipping_cost'] - (transaction['harga_satuan'] * transaction['quantity'] * 0.6)
            
            trend_data[key]['revenue'] += net_revenue
            trend_data[key]['orders'] += 1
            trend_data[key]['profit'] += profit
            if transaction['is_returned']:
                trend_data[key]['returns'] += net_revenue
            
            if transaction['customer_segment'] == 'New Customer':
                trend_data[key]['new_customers'] += 1
            else:
                trend_data[key]['returning_customers'] += 1
        
        result = []
        for period_key in sorted(trend_data.keys()):
            data_point = trend_data[period_key]
            result.append({
                'period': period_key,
                'revenue': data_point['revenue'],
                'orders': data_point['orders'],
                'profit': data_point['profit'],
                'returns': data_point['returns'],
                'new_customers': data_point['new_customers'],
                'returning_customers': data_point['returning_customers'],
                'avg_order_value': data_point['revenue'] / data_point['orders'] if data_point['orders'] > 0 else 0
            })
        
        return jsonify({'success': True, 'data': result})
    
    def get_category_performance(self):
        today = datetime.now()
        current_month = today.strftime('%Y-%m')
        previous_month = (today.replace(day=1) - timedelta(days=1)).strftime('%Y-%m')
        
        category_data = defaultdict(lambda: {
            'current': {'revenue': 0, 'orders': 0, 'profit': 0},
            'previous': {'revenue': 0, 'orders': 0, 'profit': 0},
            'total': {'revenue': 0, 'orders': 0, 'profit': 0},
            'avg_rating': []
        })
        
        for transaction in self.transactions:
            category = transaction['kategori']
            month = transaction['tanggal'][:7]
            revenue = transaction['total_penjualan'] - transaction['discount']
            profit = revenue - transaction['shipping_cost'] - (transaction['harga_satuan'] * transaction['quantity'] * 0.6)
            
            category_data[category]['total']['revenue'] += revenue
            category_data[category]['total']['orders'] += 1
            category_data[category]['total']['profit'] += profit
            category_data[category]['avg_rating'].append(transaction['rating'])
            
            if month == current_month:
                category_data[category]['current']['revenue'] += revenue
                category_data[category]['current']['orders'] += 1
                category_data[category]['current']['profit'] += profit
            elif month == previous_month:
                category_data[category]['previous']['revenue'] += revenue
                category_data[category]['previous']['orders'] += 1
                category_data[category]['previous']['profit'] += profit
        
        result = []
        for category, metrics in category_data.items():
            current_rev = metrics['current']['revenue']
            previous_rev = metrics['previous']['revenue']
            
            revenue_growth = 0
            if previous_rev > 0:
                revenue_growth = ((current_rev - previous_rev) / previous_rev) * 100
            
            avg_rating = sum(metrics['avg_rating']) / len(metrics['avg_rating']) if metrics['avg_rating'] else 0
            
            result.append({
                'category': category,
                'total_revenue': metrics['total']['revenue'],
                'total_orders': metrics['total']['orders'],
                'total_profit': metrics['total']['profit'],
                'current_month_revenue': current_rev,
                'previous_month_revenue': previous_rev,
                'revenue_growth': round(revenue_growth, 2),
                'avg_rating': round(avg_rating, 2),
                'profit_margin': round((metrics['total']['profit'] / metrics['total']['revenue']) * 100, 2) if metrics['total']['revenue'] > 0 else 0
            })
        
        result.sort(key=lambda x: x['total_revenue'], reverse=True)
        return jsonify({'success': True, 'data': result})


def create_controllers_and_routes(transactions_data):
    analytics_controller = AnalyticsController(transactions_data)

    transactions_bp.add_url_rule('/', view_func=analytics_controller.get_transactions)
    analytics_bp.add_url_rule('/overview', view_func=analytics_controller.get_analytics_overview)
    analytics_bp.add_url_rule('/revenue-trend', view_func=analytics_controller.get_revenue_trend)
    analytics_bp.add_url_rule('/category-performance', view_func=analytics_controller.get_category_performance)


    return transactions_bp, analytics_bp
