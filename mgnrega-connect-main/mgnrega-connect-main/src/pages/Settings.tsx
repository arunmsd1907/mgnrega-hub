import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    district: 'Varanasi',
    block: 'Sadar',
    wageRate: 325,
    language: 'en',
    smsAlerts: true,
    emailSummary: false,
    anomalyAlerts: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) setSettings(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      toast({ title: "Settings Saved", description: "Your configuration preferences have been updated." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">System configuration and preferences</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>District Name</Label><Input value={settings.district} onChange={(e) => setSettings({ ...settings, district: e.target.value })} /></div>
            <div className="space-y-2"><Label>Block Name</Label><Input value={settings.block} onChange={(e) => setSettings({ ...settings, block: e.target.value })} /></div>
            <div className="space-y-2"><Label>State Wage Rate (₹/day)</Label><Input type="number" value={settings.wageRate} onChange={(e) => setSettings({ ...settings, wageRate: Number(e.target.value) })} /></div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label>SMS alerts for wage credits</Label><Switch checked={settings.smsAlerts} onCheckedChange={(v) => setSettings({ ...settings, smsAlerts: v })} /></div>
          <Separator />
          <div className="flex items-center justify-between"><Label>Email daily summary</Label><Switch checked={settings.emailSummary} onCheckedChange={(v) => setSettings({ ...settings, emailSummary: v })} /></div>
          <Separator />
          <div className="flex items-center justify-between"><Label>Anomaly detection alerts</Label><Switch checked={settings.anomalyAlerts} onCheckedChange={(v) => setSettings({ ...settings, anomalyAlerts: v })} /></div>
        </CardContent>
      </Card>

      <Button className="bg-primary" onClick={handleSave} disabled={loading}>Save Settings</Button>
    </div>
  );
};

export default Settings;
