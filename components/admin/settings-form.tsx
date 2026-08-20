import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSettingsAction } from "@/lib/cms/actions";
import type { CmsSettings } from "@/types";

export function SettingsForm({ settings }: { settings: CmsSettings }) {
  return (
    <form action={saveSettingsAction} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" defaultValue={settings.email} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp (indicatif sans +)</Label>
          <Input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tagline">Accroche</Label>
          <Input id="tagline" name="tagline" defaultValue={settings.tagline} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="phones">Téléphones (un par ligne)</Label>
          <Textarea id="phones" name="phones" rows={3} defaultValue={settings.phones.join("\n")} />
        </div>
        <Field id="street" label="Rue / avenue" defaultValue={settings.address.street} />
        <Field id="neighborhood" label="Quartier" defaultValue={settings.address.neighborhood} />
        <Field id="commune" label="Commune" defaultValue={settings.address.commune} />
        <Field id="city" label="Ville" defaultValue={settings.address.city} />
        <Field id="country" label="Pays" defaultValue={settings.address.country} />
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="full">Adresse complète</Label>
          <Input id="full" name="full" defaultValue={settings.address.full} />
        </div>
        <Field id="hoursWeek" label="Horaires lun–ven" defaultValue={settings.hours[0]?.time} />
        <Field id="hoursSaturday" label="Horaires samedi" defaultValue={settings.hours[1]?.time} />
        <Field id="hoursSunday" label="Horaires dimanche" defaultValue={settings.hours[2]?.time} />
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mapsUrl">Lien Google Maps</Label>
          <Input id="mapsUrl" name="mapsUrl" defaultValue={settings.mapsUrl} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mapsEmbed">Code d’intégration Maps</Label>
          <Textarea id="mapsEmbed" name="mapsEmbed" rows={3} defaultValue={settings.mapsEmbed} />
        </div>
        <Field id="facebook" label="Facebook" defaultValue={settings.social.facebook} />
        <Field id="linkedin" label="LinkedIn" defaultValue={settings.social.linkedin} />
        <Field id="twitter" label="Twitter / X" defaultValue={settings.social.twitter} />
        <Field id="instagram" label="Instagram" defaultValue={settings.social.instagram} />
      </div>
      <Button type="submit">Enregistrer les paramètres</Button>
    </form>
  );
}

function Field({ id, label, defaultValue }: { id: string; label: string; defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} defaultValue={defaultValue} />
    </div>
  );
}
