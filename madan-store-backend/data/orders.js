// data/orders.js
const orders = [
  {
    _id: '65cb9c0f5f1b2c001c8e4d9a', // This is a sample ID
    user: '689ba6278cad4604e093cc87', // This should match a sample user ID if you have one
    orderItems: [
      {
        name: 'iPhone 15 Pro Max',
        qty: 1,
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
        price: 999,
        product: '689c1a1b8b642433d728c95f' // Sample product ID
      },
    ],
    totalPrice: 999,
    status: 'Paid' // Corrected from 'Delivered' to 'Paid'
  },
  // You can add more sample orders here if you like
];

module.exports = orders;