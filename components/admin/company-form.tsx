import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveCompanyAction } from "@/lib/cms/actions";
import type { CompanyContent } from "@/lib/cms/store";

export function CompanyForm({ company }: { company: CompanyContent }) {
  return (
    <form action={saveCompanyAction} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="historyTitle">Titre À propos</Label>
        <Input id="historyTitle" name="historyTitle" defaultValue={company.history.title} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="historyLead">Introduction</Label>
        <Textarea id="historyLead" name="historyLead" rows={4} defaultValue={company.history.lead} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="historyBody">Texte de présentation</Label>
        <Textarea id="historyBody" name="historyBody" rows={4} defaultValue={company.history.body} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vision">Vision</Label>
        <Textarea id="vision" name="vision" rows={3} defaultValue={company.vision} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="missionLead">Mission — introduction</Label>
        <Textarea id="missionLead" name="missionLead" rows={3} defaultValue={company.mission.lead} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="missionItems">Mission — points (un par ligne)</Label>
        <Textarea id="missionItems" name="missionItems" rows={5} defaultValue={company.mission.items.join("\n")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="values">Valeurs (Nom | Description)</Label>
        <Textarea
          id="values"
          name="values"
          rows={5}
          defaultValue={company.values.map((item) => `${item.name} | ${item.description}`).join("\n")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="commitments">Engagements (un par ligne)</Label>
        <Textarea id="commitments" name="commitments" rows={5} defaultValue={company.commitments.join("\n")} />
      </div>
      <Button type="submit">Enregistrer le cabinet</Button>
    </form>
  );
}
