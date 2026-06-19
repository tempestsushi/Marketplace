import { useEffect, useState } from 'react';
import { MessageCircle, PackageCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cancelOrder, completeOrder, listMyOrders } from '../api/ordersClient';
import { ToastContainer } from '../components/Toast';

function Orders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [toasts, setToasts] = useState([]);

  function addToast(message, type = 'success') {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }
  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await listMyOrders();
        if (!alive) return;
        setOrders(resp.rows || []);
      } catch (e) {
        if (!alive) return;
        addToast(e.message || 'Failed to load orders', 'error');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function refresh() {
    try {
      const resp = await listMyOrders();
      setOrders(resp.rows || []);
    } catch (e) {
      addToast(e.message || 'Failed to load orders', 'error');
    }
  }

  function handleMessage(order) {
    if (!order?.counterpart?.id) {
      addToast('This order has no single user to message.', 'error');
      return;
    }

    navigate('/messages', {
      state: {
        openChat: {
          userId: order.counterpart.id,
          userName: order.counterpart.name,
          productId: order.productId || null,
          productTitle: order.productTitle || '',
        },
      },
    });
  }

  async function handleCancel(order) {
    try {
      await cancelOrder(order.orderId);
      addToast('Order cancelled. Listing is available again.', 'info');
      await refresh();
    } catch (e) {
      addToast(e.message || 'Failed to cancel order', 'error');
    }
  }

  async function handleComplete(order) {
    try {
      await completeOrder(order.orderId);
      addToast('Order marked completed. Product removed from listings.', 'success');
      await refresh();
    } catch (e) {
      addToast(e.message || 'Failed to complete order', 'error');
    }
  }

  return (
    <main className="pt-20 pb-16 px-4 page-enter">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <PackageCheck size={20} className="text-[#304826]" />
          My Orders
        </h1>

        <div className="bg-white border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">With</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td className="px-6 py-6 text-gray-500" colSpan={9}>Loading orders…</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td className="px-6 py-6 text-gray-500" colSpan={9}>No orders yet.</td></tr>
                ) : orders.map((o) => (
                  <tr key={`${o.perspective}-${o.orderId}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">#{o.orderId}</td>
                    <td className="px-4 py-4">
                      <div className="max-w-[220px] truncate font-semibold text-gray-900" title={o.productTitle || 'Product unavailable'}>
                        {o.productTitle || 'Product unavailable'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700 capitalize">{o.perspective}</td>
                    <td className="px-4 py-4 text-gray-700">{o?.counterpart?.name || '—'}</td>
                    <td className="px-4 py-4 text-gray-600">{new Date(o.orderDate).toLocaleDateString('en-PK')}</td>
                    <td className="px-4 py-4 text-gray-700">{o.itemsCount}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold px-2 py-1 bg-[#e4ded2] text-[#304826] capitalize">
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-[#304826]">PKR {Number(o.totalAmount).toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleMessage(o)}
                          className="p-2 hover:bg-[#e4ded2] text-[#304826] transition-colors"
                          title={o?.counterpart?.id ? 'Message' : 'No message recipient'}
                        >
                          <MessageCircle size={14} />
                        </button>
                        {['pending', 'confirmed'].includes(String(o.status)) && (
                          <button
                            type="button"
                            onClick={() => void handleCancel(o)}
                            className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                            title="Cancel order"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                        {o.perspective === 'seller' && ['pending', 'confirmed'].includes(String(o.status)) && (
                          <button
                            type="button"
                            onClick={() => void handleComplete(o)}
                            className="p-2 hover:bg-green-50 text-green-600 transition-colors"
                            title="Mark completed"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  );
}

export default Orders;
