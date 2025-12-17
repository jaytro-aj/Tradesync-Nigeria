import React, { useState } from 'react';
import { Rider } from '../types';
import { Truck, MapPin, Star, Navigation, Phone } from 'lucide-react';

const mockRiders: Rider[] = [
  { id: '1', name: 'Gokada Connect', rating: 4.8, vehicle: 'bike', distance: '0.8 km', verified: true },
  { id: '2', name: 'Kwik Delivery', rating: 4.5, vehicle: 'bike', distance: '1.2 km', verified: true },
  { id: '3', name: 'Red Star Express', rating: 4.9, vehicle: 'van', distance: '3.5 km', verified: true },
  { id: '4', name: 'Local Rider (Musa)', rating: 4.2, vehicle: 'bike', distance: '0.3 km', verified: false },
];

const Logistics: React.FC = () => {
  const [selectedRider, setSelectedRider] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'searching' | 'confirmed'>('idle');

  const handleRequest = (id: string) => {
    setSelectedRider(id);
    setRequestStatus('searching');
    setTimeout(() => {
      setRequestStatus('confirmed');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Dispatch Request</h2>
        <p className="text-slate-500">Find nearby verified logistics partners.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-slate-200 rounded-2xl h-64 lg:h-96 relative overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center bg-slate-300">
             <div className="text-center">
               <MapPin size={48} className="mx-auto text-slate-400 mb-2" />
               <p className="text-slate-500 font-medium">Map View</p>
               <p className="text-xs text-slate-400">Simulated Location: Ikeja, Lagos</p>
             </div>
          </div>
          {/* Simulated Map Markers */}
          <div className="absolute top-1/4 left-1/4 p-2 bg-emerald-600 rounded-full shadow-lg ring-4 ring-emerald-600/20">
            <Truck className="text-white" size={20} />
          </div>
          <div className="absolute bottom-1/3 right-1/3 p-2 bg-slate-800 rounded-full shadow-lg">
            <Truck className="text-white" size={16} />
          </div>
          <div className="absolute top-1/2 right-10 p-2 bg-slate-800 rounded-full shadow-lg">
            <Truck className="text-white" size={16} />
          </div>
        </div>

        {/* Rider List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700">Available Near You</h3>
          
          {requestStatus === 'confirmed' ? (
             <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
               <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Truck size={32} className="text-emerald-600" />
               </div>
               <h4 className="font-bold text-emerald-900 text-lg">Rider Confirmed!</h4>
               <p className="text-emerald-700 text-sm mb-4">Gokada Connect is on the way to your pickup location.</p>
               <button onClick={() => setRequestStatus('idle')} className="text-sm font-medium text-emerald-600 hover:underline">
                 Cancel Request
               </button>
             </div>
          ) : (
            <div className="space-y-3">
              {mockRiders.map((rider) => (
                <div 
                  key={rider.id}
                  className={`bg-white p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                    selectedRider === rider.id ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-100'
                  }`}
                  onClick={() => setSelectedRider(rider.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{rider.name}</span>
                      {rider.verified && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">VERIFIED</span>}
                    </div>
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                      <Star size={12} fill="currentColor" />
                      {rider.rating}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-slate-500 mb-3">
                    <span className="flex items-center gap-1 capitalize">
                      <Truck size={14} /> {rider.vehicle}
                    </span>
                    <span className="flex items-center gap-1">
                      <Navigation size={14} /> {rider.distance}
                    </span>
                  </div>

                  {selectedRider === rider.id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRequest(rider.id); }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                      disabled={requestStatus === 'searching'}
                    >
                      {requestStatus === 'searching' ? 'Requesting...' : 'Request Pickup'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logistics;