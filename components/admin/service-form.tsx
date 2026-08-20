import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveServiceAction } from "@/lib/cms/actions";
import type { ServiceItem } from "@/types";

export function ServiceForm({ service, media }: { service?: ServiceItem; media: string[] }) {
  return (
    <form action={saveServiceAction} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="currentId" value={service?.id ?? ""} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" required defaultValue={service?.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="id">Identifiant (optionnel)</Label>
          <Input id="id" name="id" defaultValue={service?.id} />
        </div>
      </div>
      <ImageField name="image" label="Image" defaultValue={service?.image} media={media} />
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Résumé (cartes)</Label>
        <Textarea id="shortDescription" name="shortDescription" rows={2} required defaultValue={service?.shortDescription} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} required defaultValue={service?.description} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="features">Prestations (une par ligne)</Label>
        <Textarea id="features" name="features" rows={6} defaultValue={(service?.features ?? []).join("\n")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="process">Processus (une étape par ligne : Étape | Description)</Label>
        <Textarea
          id="process"
          name="process"
          rows={6}
          defaultValue={(service?.process ?? []).map((item) => `${item.step} | ${item.description}`).join("\n")}
        />
      </div>
      <Button type="submit">{service ? "Enregistrer le service" : "Créer le service"}</Button>
    </form>
  );
}
