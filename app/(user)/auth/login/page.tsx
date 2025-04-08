import { LoginForm } from '@/components/forms/login-form'
import { getOauth2AuthUrl } from '@/network/server/auth'

export default async function LoginPage() {
  const oauth2AuthUrl = await getOauth2AuthUrl()
  return <LoginForm oauth2AuthUrl={oauth2AuthUrl.data.url} />
}
