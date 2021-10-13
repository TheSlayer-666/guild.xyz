import useImmutableSWR from "swr/immutable"
import { User } from "temporaryData/types"
import { useGuild } from "../Context"

const getIsOwner = async (_, ownerAddresses: User[], checkAddress: string) =>
  ownerAddresses.some(({ address }) => address === checkAddress?.toLowerCase())

const useIsOwner = (checkAddress: string) => {
  const { group, guild } = useGuild()
  const owner = group?.owner || guild?.owner

  const shouldFetch = owner && checkAddress

  const { data } = useImmutableSWR(
    shouldFetch ? ["isOwner", owner?.addresses, checkAddress] : null,
    getIsOwner
  )

  return data
}

export default useIsOwner
