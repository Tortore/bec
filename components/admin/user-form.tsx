import { saveUserAction } from "@/lib/cms/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminAccount } from "@/types";

export function UserForm({ user }: { user?: AdminAccount }) {
  return (
    <form action={saveUserAction} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="currentId" value={user?.id ?? ""} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom affiché</Label>
          <Input id="name" name="name" required defaultValue={user?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Identifiant de connexion</Label>
          <Input id="username" name="username" required defaultValue={user?.username} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" defaultValue={user?.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <select
            id="role"
            name="role"
            defaultValue={user?.role ?? "admin"}
            className="h-12 w-full rounded-md border border-input bg-white px-3 text-sm"
          >
            <option value="admin">Administrateur</option>
            <option value="editor">Éditeur</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="password">{user ? "Nouveau mot de passe (laisser vide pour conserver)" : "Mot de passe"}</Label>
          <Input id="password" name="password" type="password" minLength={user ? undefined : 8} required={!user} />
          <p className="text-xs text-slate-500">Minimum 8 caractères.</p>
        </div>
      </div>
      {user ? (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={user.active} />
          Compte actif
        </label>
      ) : (
        <input type="hidden" name="active" value="on" />
      )}
      <Button type="submit">{user ? "Enregistrer l’utilisateur" : "Créer l’utilisateur"}</Button>
    </form>
  );
}
