import React, { useEffect, useRef, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/integration/api/client';
import { MapPin, Users, AlertTriangle, Link2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type MemberPoint = {
  user_id: number;
  lat: number;
  lng: number;
  ts: number;
};

const TripTracker: React.FC = () => {
  const { toast } = useToast();
  const [tripId, setTripId] = useState<number | null>(null);
  const [invite, setInvite] = useState<string>('');
  const [joinTripId, setJoinTripId] = useState<string>('');
  const [joinToken, setJoinToken] = useState<string>('');
  const [points, setPoints] = useState<MemberPoint[]>([]);
  const [lastFetch, setLastFetch] = useState<string | undefined>(undefined);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!tripId) return;
    let active = true;
    const tick = async () => {
      try {
        const resp = await apiClient.getLocations(tripId, lastFetch);
        if (resp.status === 'success') {
          const now = new Date().toISOString();
          const newPoints: MemberPoint[] = (resp.data || []).map((r: any) => ({
            user_id: r.user_id,
            lat: r.lat,
            lng: r.lng,
            ts: new Date(r.created_at).getTime()
          }));
          if (active && newPoints.length > 0) {
            setPoints(prev => {
              const merged = [...prev, ...newPoints].slice(-1000);
              const latest = new Map<number, MemberPoint>();
              merged.forEach(p => {
                const prevP = latest.get(p.user_id);
                if (!prevP || p.ts > prevP.ts) latest.set(p.user_id, p);
              });
              return Array.from(latest.values());
            });
          }
          if (active) setLastFetch(now);
        }
      } catch {}
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [tripId, lastFetch]);

  const startSharing = () => {
    if (!tripId) {
      toast({ title: 'Join or create a trip first', variant: 'destructive' });
      return;
    }
    if (!navigator.geolocation) {
      toast({ title: 'Geolocation not supported', variant: 'destructive' });
      return;
    }
    if (watchIdRef.current !== null) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        try {
          await apiClient.postLocation(tripId, {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            heading: pos.coords.heading || undefined,
            speed: pos.coords.speed || undefined
          });
        } catch {}
      },
      (err) => {
        toast({ title: 'Location error', description: err.message, variant: 'destructive' });
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    toast({ title: 'Sharing started' });
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      toast({ title: 'Sharing paused' });
    }
  };

  const createTrip = async () => {
    try {
      const resp = await apiClient.createTrip('Group Trip');
      if (resp.status === 'success') {
        setTripId(resp.data.id);
        setInvite(resp.data.invite_code);
        setPoints([]);
        setLastFetch(undefined);
        toast({ title: 'Trip created', description: `Invite code: ${resp.data.invite_code}` });
      }
    } catch {
      toast({ title: 'Failed to create trip', variant: 'destructive' });
    }
  };

  const joinTrip = async () => {
    try {
      const id = parseInt(joinTripId);
      if (!id || !joinToken) {
        toast({ title: 'Enter trip id and invite code', variant: 'destructive' });
        return;
      }
      const resp = await apiClient.joinTrip(id, joinToken);
      if (resp.status === 'success') {
        setTripId(id);
        setInvite(joinToken);
        setPoints([]);
        setLastFetch(undefined);
        toast({ title: 'Joined trip' });
      }
    } catch {
      toast({ title: 'Failed to join trip', variant: 'destructive' });
    }
  };

  const triggerSOS = async () => {
    if (!tripId) return;
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await apiClient.triggerSOS(tripId, { lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast({ title: 'SOS sent', variant: 'destructive' });
      }, async () => {
        await apiClient.triggerSOS(tripId, { lat: 0, lng: 0 });
        toast({ title: 'SOS sent', variant: 'destructive' });
      });
    } catch {
      toast({ title: 'Failed to send SOS', variant: 'destructive' });
    }
  };

  const center = points.length ? [points[0].lat, points[0].lng] as [number, number] : [20.5937, 78.9629];

  return (
    <div className="min-h-screen">
      <NavBar />

      <section className="pt-28 pb-8 bg-[#E6F0FF]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Group Trip <span className="text-orange-500">Tracker</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Share your live location with friends during a trip, see everyone on a common map, and trigger SOS if needed.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold">Create Trip</div>
                  <Button onClick={createTrip} className="w-full">
                    <Users className="w-4 h-4 mr-2" /> New Trip
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold">Join Trip</div>
                  <div className="flex gap-2">
                    <Input placeholder="Trip ID" value={joinTripId} onChange={(e) => setJoinTripId(e.target.value)} />
                    <Input placeholder="Invite Code" value={joinToken} onChange={(e) => setJoinToken(e.target.value)} />
                  </div>
                  <Button onClick={joinTrip} className="w-full" variant="outline">
                    <Link2 className="w-4 h-4 mr-2" /> Join
                  </Button>
                </div>
                {tripId && (
                  <>
                    <div className="text-sm">
                      <span className="font-semibold">Trip:</span> #{tripId}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Invite:</span> {invite || '—'}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={startSharing} className="w-full">Start Sharing</Button>
                      <Button onClick={stopSharing} variant="outline" className="w-full">Pause</Button>
                    </div>
                    <Button onClick={triggerSOS} variant="destructive" className="w-full">
                      <AlertTriangle className="w-4 h-4 mr-2" /> SOS
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="p-0">
                <MapContainer center={center} zoom={5} style={{ height: 420, width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {points.map((p, idx) => {
                    const lastMin = Math.max(0, Math.floor((Date.now() - p.ts) / 60000));
                    const color = lastMin < 1 ? '#0ea5e9' : lastMin < 5 ? '#f59e0b' : '#ef4444';
                    return (
                      <CircleMarker key={idx} center={[p.lat, p.lng]} radius={8} pathOptions={{ color, fillColor: color, fillOpacity: 0.8 }}>
                        <Popup>
                          <div className="text-sm">
                            <div className="font-semibold flex items-center"><MapPin className="w-4 h-4 mr-1" /> User #{p.user_id}</div>
                            <div className="text-gray-600">{lastMin < 1 ? 'online' : `last seen ${lastMin}m`}</div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TripTracker;


