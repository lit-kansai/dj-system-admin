import { z } from 'zod'
import { apiClient, ApiInstance } from '@/libs/api'
import { CamelizedAPIResponse, toSchema } from '@/types'
import { GetRequestOutput } from '@/libs'

export type linkSpotifyInput = { redirectUrl: string }

export type linkSpotifyResponse = CamelizedAPIResponse<ApiInstance['mc']['user']['link']['spotify']['$get']>

const responseSchema = toSchema<linkSpotifyResponse>()(
  z.object({
    redirectUrl: z.string()
  })
)

export const linkSpotify = async (input: linkSpotifyInput): GetRequestOutput<linkSpotifyResponse> => {
  const result = await useLazyAsyncData(async () => {
    const response = await apiClient().mc.user.link.spotify.$get({
      query: { redirect_url: window.location.origin + input.redirectUrl }
    })

    const parseResult = responseSchema.safeParse(response)
    if (!parseResult.success) {
      const { setCurrentError } = useCurrentError()
      setCurrentError(parseResult.error)
      throw parseResult.error
    }
    return parseResult.data
  }, {
    immediate: false
  })
  return result
}
