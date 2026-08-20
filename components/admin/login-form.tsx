"use client";

import { useState } from "react";
import { loginAction } from "@/lib/cms/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-5"
      action={async (formData) => {
        setPending(true);
        setError("");
        const result = await loginAction(formData);
        if (result && !result.ok) {
          setError(result.error);
          setPending(false);
        }
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="username">Identifiant</Label>
        <Input id="username" name="username" autoComplete="username" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
