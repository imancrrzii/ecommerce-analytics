import random
from datetime import datetime, timedelta

class ECommerceDataGenerator:
    def __init__(self):
        self.categories = [
            'Elektronik', 'Fashion', 'Makanan & Minuman', 'Kesehatan & Kecantikan',
            'Olahraga & Outdoor', 'Rumah Tangga', 'Buku & Media', 'Otomotif',
            'Mainan & Hobi', 'Perhiasan & Aksesoris'
        ]
        
        self.regions_with_weights = {
            'Jakarta': 0.35,  
            'Surabaya': 0.15,
            'Bandung': 0.15,
            'Medan': 0.08,
            'Makassar': 0.05,
            'Semarang': 0.05,
            'Palembang': 0.07,
            'Batam': 0.03,
            'Yogyakarta': 0.03,
            'Denpasar': 0.04,
        }
        
        self.payment_methods = ['Credit Card', 'Bank Transfer', 'E-Wallet', 'COD', 'Virtual Account']
        self.customer_segments = ['Premium', 'Regular', 'New Customer', 'VIP']
        
        self.seasonal_patterns = {
            'Fashion': [0.8, 0.9, 1.1, 1.2, 1.0, 0.9, 0.8, 0.8, 0.9, 1.1, 1.3, 1.4],
            'Elektronik': [1.2, 0.9, 1.0, 1.0, 1.0, 1.1, 0.9, 0.8, 1.0, 1.1, 1.3, 1.5],
            'Makanan & Minuman': [1.0, 1.0, 1.0, 1.1, 1.2, 1.0, 0.9, 0.9, 1.0, 1.1, 1.2, 1.3],
        }

        self.product_data = {
            'Elektronik': {
                'brands': ['Samsung', 'Apple', 'Xiaomi', 'LG', 'Sony'],
                'products': ['Smartphone', 'Smart TV', 'Laptop', 'Earbuds', 'Smartwatch'],
                'quantity_range': (1, 2)
            },
            'Fashion': {
                'brands': ['Nike', 'Adidas', 'Zara', 'Uniqlo', 'Levis'],
                'products': ['T-Shirt', 'Jeans', 'Sepatu Olahraga', 'Jaket', 'Gaun'],
                'quantity_range': (1, 3)
            },
            'Makanan & Minuman': {
                'brands': ['Indofood', 'Nestle', 'Wings', 'Coca-Cola', 'GarudaFood'],
                'products': ['Mie Instan', 'Kopi', 'Biskuit', 'Susu UHT', 'Keripik'],
                'quantity_range': (2, 15)
            },
            'Kesehatan & Kecantikan': {
                'brands': ['Wardah', 'Somethinc', 'Skintific', 'Pepsodent', 'Biore'],
                'products': ['Skincare Set', 'Serum Wajah', 'Pasta Gigi', 'Body Lotion', 'Sunscreen'],
                'quantity_range': (1, 5)
            },
            'Olahraga & Outdoor': {
                'brands': ['Decathlon', 'Reebok', 'Columbia', 'Eiger', 'Consina'],
                'products': ['Matras Yoga', 'Sepatu Lari', 'Ransel Hiking', 'Botol Minum', 'Tenda'],
                'quantity_range': (1, 3)
            },
            'Rumah Tangga': {
                'brands': ['IKEA', 'Tefal', 'Maspion', 'Sharp', 'Philips'],
                'products': ['Panci', 'Sapu Listrik', 'Blender', 'Lampu LED', 'Meja Lipat'],
                'quantity_range': (1, 4)
            },
            'Buku & Media': {
                'brands': ['Gramedia', 'Elex Media', 'Mizan', 'Penerbit Erlangga'],
                'products': ['Novel Fiksi', 'Buku Motivasi', 'Komik', 'Buku Resep', 'Ensiklopedia'],
                'quantity_range': (1, 5)
            },
            'Otomotif': {
                'brands': ['Shell', 'Pertamina', 'Michelin', 'Bridgestone'],
                'products': ['Oli Mesin', 'Ban Mobil', 'Helm', 'Wiper Kaca', 'Busi'],
                'quantity_range': (1, 2)
            },
            'Mainan & Hobi': {
                'brands': ['LEGO', 'Hasbro', 'Mattel', 'Tamiya', 'Bandai'],
                'products': ['Set LEGO', 'Boneka Barbie', 'Mobil Remote Control', 'Action Figure', 'Puzzle'],
                'quantity_range': (1, 3)
            },
            'Perhiasan & Aksesoris': {
                'brands': ['Toko Emas Semar', 'Frank & co.', 'The Palace', 'Swarovski'],
                'products': ['Cincin', 'Kalung', 'Anting', 'Gelang', 'Jam Tangan'],
                'quantity_range': (1, 1)
            }
        }
        
    def generate_transactions(self, days=365, count=5000):
        transactions = []
        base_date = datetime.now() - timedelta(days=days)
        
        regions_list = list(self.regions_with_weights.keys())
        weights_list = list(self.regions_with_weights.values())
        
        for i in range(count):
            random_days = random.randint(0, days)
            transaction_date = base_date + timedelta(days=random_days)
            month = transaction_date.month
            
            region = random.choices(regions_list, weights=weights_list, k=1)[0]
            category = random.choice(self.categories)
            
            category_data = self.product_data.get(category, {
                'brands': ['Generic Brand'],
                'products': ['Generic Product'],
                'quantity_range': (1, 5)
            })
            
            brand = random.choice(category_data['brands'])
            product_name = random.choice(category_data['products'])

            seasonal_multiplier = self.seasonal_patterns.get(category, [1.0] * 12)[month - 1]
            base_price = random.randint(50000, 2000000)
            price = int(base_price * seasonal_multiplier)
            
            growth_factor = 1 + (random_days / days) * 0.3
            price = int(price * growth_factor)
            
            noise = random.uniform(0.8, 1.2)
            price = int(price * noise)
            
            min_q, max_q = category_data['quantity_range']
            quantity = random.randint(min_q, max_q)
            
            transaction = {
                'id': i + 1,
                'tanggal': transaction_date.strftime('%Y-%m-%d'),
                'kategori': category,
                'brand': brand,
                'product_name': product_name,
                'region': region,
                'harga_satuan': price,
                'quantity': quantity,
                'total_penjualan': price * quantity,
                'payment_method': random.choice(self.payment_methods),
                'customer_segment': random.choice(self.customer_segments),
                'rating': round(random.uniform(3.0, 5.0), 1),
                'is_returned': random.random() < 0.05,
                'shipping_cost': random.randint(10000, 50000),
                'discount': random.randint(0, price * quantity // 10),
                'customer_age': random.randint(18, 65),
                'acquisition_channel': random.choice(['Organic', 'Social Media', 'Google Ads', 'Email', 'Referral'])
            }
            transactions.append(transaction)
            
        return sorted(transactions, key=lambda x: x['tanggal'])