'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ProfileForm({ user }: { user: any }) {
  const [firstName, setFirstName] = useState(user?.user_metadata?.firstName || '')
  const [lastName, setLastName] = useState(user?.user_metadata?.lastName || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Inicály uživatele pro avatar fallback
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    } else if (firstName) {
      return firstName.substring(0, 2).toUpperCase()
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          firstName,
          lastName,
          avatar_url: avatarUrl,
          full_name: `${firstName} ${lastName}`.trim()
        }
      })

      if (error) throw error
      
      toast.success('Profil byl úspěšně aktualizován')
      router.refresh() // Aktualizace serverových komponent
    } catch (error: any) {
      toast.error(`Chyba při aktualizaci profilu: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Funkce pro nahrání obrázku
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`

    setIsLoading(true)

    try {
      // 1. Nahrát soubor do Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Získat veřejnou URL
      const { data: publicUrlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const newAvatarUrl = publicUrlData.publicUrl

      // 3. Nastavit URL v state a v profilu
      setAvatarUrl(newAvatarUrl)

      // 4. Aktualizovat user_metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: newAvatarUrl
        }
      })

      if (updateError) throw updateError

      toast.success('Profilový obrázek byl úspěšně nahrán')
    } catch (error: any) {
      toast.error(`Chyba při nahrávání obrázku: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
          <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="avatar">Profilový obrázek</Label>
          <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarUpload} />
          <p className="text-xs text-muted-foreground">
            Doporučený formát: čtvercový JPG, PNG nebo GIF, max 2MB
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="firstName">Jméno</Label>
          <Input 
            id="firstName" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            placeholder="Zadejte své jméno"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="lastName">Příjmení</Label>
          <Input 
            id="lastName" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            placeholder="Zadejte své příjmení"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={user?.email} disabled />
        <p className="text-xs text-muted-foreground">
          Email nelze změnit, je vázaný na váš účet
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Ukládám...' : 'Uložit změny'}
      </Button>
    </form>
  )
} 