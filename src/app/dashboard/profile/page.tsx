import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  // Získáme data uživatele
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return redirect('/login')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Uživatelský profil</h1>
        <Card>
          <CardHeader>
            <CardTitle>Osobní informace</CardTitle>
            <CardDescription>
              Upravte své osobní údaje a profilový obrázek
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 