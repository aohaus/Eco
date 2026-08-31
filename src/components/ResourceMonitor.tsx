import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Flame, 
  Sun, 
  Plus, 
  Calendar, 
  Trash2,
  TrendingDown,
  Info
} from 'lucide-react';
import { ResourceLog } from '../types';

interface ResourceMonitorProps {
  logs: ResourceLog[];
  onAddLog: (newLog: Omit<ResourceLog, 'id'>) => void;
  onDeleteLog: (id: string) => void;
}

export const ResourceMonitor: React.FC<ResourceMonitorProps> = ({
  logs,
  onAddLog,
  onDeleteLog,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [resourceType, setResourceType] = useState<ResourceLog['type']>('electricity');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const getUnit = (type: ResourceLog['type']) => {
    switch (type) {
      case 'electricity': return 'kWh';
      case 'water': return 'L';
      case 'gas': return 'm³';
      case 'solar': return 'kWh';
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    onAddLog({
      date,
      type: resourceType,
      amount: Number(amount),
      unit: getUnit(resourceType),
      notes: notes.trim() || undefined,
    });

    setAmount('');
    setNotes('');
    setShowModal(false);
  };

  // Group totals
  const totalElectricity = logs.filter(l => l.type === 'electricity').reduce((acc, l) => acc + l.amount, 0);
  const totalWater = logs.filter(l => l.type === 'water').reduce((acc, l) => acc + l.amount, 0);
  const totalGas = logs.filter(l => l.type === 'gas').reduce((acc, l) => acc + l.amount, 0);
  const totalSolar = logs.filter(l => l.type === 'solar').reduce((acc, l) => acc + l.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Home Resource & Meter Monitor</h1>
          <p className="text-sm text-stone-600 mt-1">
            Track utility meter readings, monitor solar generation, and detect consumption spikes.
          </p>
        </div>

        <button
          id="log-meter-reading-btn"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Meter Reading</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Grid Electricity</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 mt-3">
            {totalElectricity.toLocaleString()} <span className="text-xs font-normal text-stone-500">kWh</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Total recorded grid power</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Freshwater</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 mt-3">
            {totalWater.toLocaleString()} <span className="text-xs font-normal text-stone-500">L</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Total recorded water use</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Natural Gas</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 mt-3">
            {totalGas.toLocaleString()} <span className="text-xs font-normal text-stone-500">m³</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Total recorded heating gas</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Solar Generation</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 mt-3">
            {totalSolar.toLocaleString()} <span className="text-xs font-normal text-stone-500">kWh</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Clean self-generated power</div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">Recent Meter Records</h2>
          <span className="text-xs text-stone-500">{logs.length} entries</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm">
            No meter readings recorded yet. Click "Log Meter Reading" to add your first entry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-600 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Resource Type</th>
                  <th className="px-6 py-3">Reading</th>
                  <th className="px-6 py-3">Notes</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/60">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-stone-600">
                      {log.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                        log.type === 'electricity' ? 'bg-amber-100 text-amber-800' :
                        log.type === 'water' ? 'bg-sky-100 text-sky-800' :
                        log.type === 'gas' ? 'bg-rose-100 text-rose-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-stone-900">
                      {log.amount} {log.unit}
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-500 max-w-xs truncate">
                      {log.notes || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-stone-900">Log Resource Reading</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Resource Type</label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="electricity">Electricity (kWh)</option>
                  <option value="water">Water (Liters)</option>
                  <option value="gas">Natural Gas (m³)</option>
                  <option value="solar">Solar Generation (kWh)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reading Amount ({getUnit(resourceType)})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 14.5"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Monthly bill meter reading"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
