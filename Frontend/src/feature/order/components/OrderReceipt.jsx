import React from 'react';

const OrderReceipt = ({ order }) => {
  if (!order) return null;

  return (
    <div id="order-receipt" className="bg-white text-black p-12 max-w-[800px] mx-auto print:p-0 print:m-0 print:max-w-none font-inter">
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">SNITCH</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Precision Luxury Retail</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black uppercase mb-1 tracking-tight">Receipt</h2>
          <p className="text-sm text-gray-600 font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-12 mb-16 pb-12 border-b border-gray-100">
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 font-black">01. Shipping Destination</h3>
          <div className="text-sm leading-relaxed text-gray-800">
            <p className="font-bold text-black text-base mb-1">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="mt-3 font-medium"><span className="text-gray-400 mr-2">T:</span> {order.shippingAddress.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 font-black">02. Transaction Details</h3>
          <div className="text-sm leading-relaxed space-y-2">
            <p className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Method</span> <span className="font-bold">Razorpay Online</span></p>
            <p className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Status</span> <span className="font-bold text-[#FF6B35]">{order.status.toUpperCase()}</span></p>
            <p className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Currency</span> <span className="font-bold">INR (₹)</span></p>
          </div>
        </div>
      </div>

      {/* Manifest */}
      <div className="mb-16">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-8 font-black">03. Itemized Manifest</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-900 text-[10px] uppercase tracking-[0.2em] font-black">
              <th className="py-4">Item Description</th>
              <th className="py-4 text-center">Qty</th>
              <th className="py-4 text-right">Unit Price</th>
              <th className="py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <tr key={idx} className="text-sm group">
                <td className="py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-gray-50 flex-shrink-0 overflow-hidden">
                       <img 
                          src={item.product?.images?.[0]?.url || item.product?.images?.[0] || 'https://via.placeholder.com/100'} 
                          alt="" 
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                        />
                    </div>
                    <div>
                      <p className="font-bold text-black text-base leading-tight mb-1">{item.product?.title || 'Product'}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">SKU: {item.product?._id?.slice(-6).toUpperCase() || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-8 text-center font-medium">{item.quantity}</td>
                <td className="py-8 text-right font-medium">₹{item.price.toLocaleString()}</td>
                <td className="py-8 text-right font-black text-base">₹{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end pt-8 border-t-4 border-gray-900">
        <div className="w-72 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 uppercase tracking-widest font-bold">Subtotal</span>
            <span className="font-bold">₹{(order.totalAmount - (order.totalAmount > 1000 ? 0 : 99)).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 uppercase tracking-widest font-bold">Shipping</span>
            <span className="font-bold">{order.totalAmount > 1000 ? 'FREE' : '₹99.00'}</span>
          </div>
          <div className="flex justify-between text-2xl font-black pt-6 border-t border-gray-100">
            <span className="tracking-tighter">TOTAL</span>
            <span className="tracking-tighter">₹{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-40 pt-12 border-t border-gray-100 text-center">
        <div className="inline-block border border-black px-6 py-2 mb-8">
           <p className="text-[10px] font-black uppercase tracking-[0.4em]">Thank You For Choosing Snitch</p>
        </div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-300 font-medium max-w-md mx-auto leading-relaxed">
          This is a computer generated document. No signature is required. For any queries regarding this manifest, please contact support@snitch.co.in
        </p>
        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mt-8 font-black">
          © 2024 SNITCH. PRECISION LUXURY RETAIL.
        </p>
      </div>
    </div>
  );
};

export default OrderReceipt;
