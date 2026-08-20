import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveTeamMemberAction } from "@/lib/cms/actions";
import { teamDepartments, type TeamMember } from "@/types";

const departmentLabels: Record<TeamMember["department"], string> = {
  direction: "Direction",
  architecture: "Architecture",
  ingenierie: "Ingénierie",
  support: "Support",
};

export function TeamForm({ member, media }: { member?: TeamMember; media: string[] }) {
  return (
    <form action={saveTeamMemberAction} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="currentId" value={member?.id ?? ""} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" required defaultValue={member?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Fonction</Label>
          <Input id="role" name="role" required defaultValue={member?.role} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialty">Spécialité</Label>
          <Input id="specialty" name="specialty" required defaultValue={member?.specialty} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Pôle</Label>
          <select
            id="department"
            name="department"
            defaultValue={member?.department ?? "architecture"}
            className="h-12 w-full rounded-md border border-input bg-white px-3 text-sm"
          >
            {teamDepartments.map((department) => (
              <option key={department} value={department}>
                {departmentLabels[department]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ImageField
        name="image"
        label="Photo"
        defaultValue={member?.image}
        media={media}
        previewClassName="object-contain object-bottom"
      />
      <Button type="submit">{member ? "Enregistrer" : "Ajouter à l’équipe"}</Button>
    </form>
  );
}
