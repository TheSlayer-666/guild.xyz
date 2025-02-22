import {
  GridItem,
  HStack,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import HallCard from "components/index/HallCard"
import HallsGuildsNav from "components/index/HallsGuildsNav"
import useFilteredData from "components/index/hooks/useFilteredData"
import useUsersHallsGuilds from "components/index/hooks/useUsersHallsGuilds"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { Hall } from "temporaryData/types"
import fetchApi from "utils/fetchApi"

type Props = {
  halls: Hall[]
}

const Page = ({ halls: hallsInitial }: Props): JSX.Element => {
  const { data: halls } = useSWR("/group", {
    fallbackData: hallsInitial,
  })
  const [searchInput, setSearchInput] = useState("")
  const [orderedHalls, setOrderedHalls] = useState(halls)

  const { usersHallsIds } = useUsersHallsGuilds()
  const [usersHalls, filteredHalls, filteredUsersHalls] = useFilteredData(
    orderedHalls,
    usersHallsIds,
    searchInput
  )

  // Setting up the dark mode, because this is a "static" page
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  return (
    <Layout
      title="Guild"
      description="A place for Web3 guilds"
      imageUrl="/guildLogos/logo.svg"
      imageBg="transparent"
    >
      <SimpleGrid
        templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
        gap={{ base: 2, md: "6" }}
        mb={16}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <SearchBar placeholder="Search halls" setSearchInput={setSearchInput} />
        </GridItem>
        <OrderSelect data={halls} setOrderedData={setOrderedHalls} />
      </SimpleGrid>

      <HallsGuildsNav />

      <Stack spacing={12}>
        <CategorySection
          title={
            usersHalls.length ? "Your halls" : "You're not part of any halls yet"
          }
          fallbackText={`No results for ${searchInput}`}
        >
          {usersHalls.length ? (
            filteredUsersHalls.length &&
            filteredUsersHalls
              .map((hall) => <HallCard key={hall.id} hallData={hall} />)
              .concat(
                <AddCard key="create-hall" text="Create hall" link="/create-hall" />
              )
          ) : (
            <AddCard text="Create hall" link="/create-hall" />
          )}
        </CategorySection>
        <CategorySection
          title={
            <HStack spacing={2} alignItems="center">
              <Text as="span">All halls</Text>
              <Tag size="sm">{filteredHalls.length}</Tag>
            </HStack>
          }
          fallbackText={
            orderedHalls.length
              ? `No results for ${searchInput}`
              : "Can't fetch halls from the backend right now. Check back later!"
          }
        >
          {filteredHalls.length &&
            filteredHalls.map((hall) => <HallCard key={hall.id} hallData={hall} />)}
        </CategorySection>
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const halls = await fetchApi("/group")

  return {
    props: { halls },
    revalidate: 10,
  }
}

export default Page
