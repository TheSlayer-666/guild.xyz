import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import { MagnifyingGlass } from "phosphor-react"
import React, { useRef } from "react"

type Props = {
  placeholder?: string
  setSearchInput: (value: string) => void
}

const SearchBar = ({
  placeholder = "Search...",
  setSearchInput,
}: Props): JSX.Element => {
  const inputTimeout = useRef(null)
  const handleOnChange = async ({ target: { value } }) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(value), 300)
  }

  return (
    <InputGroup size="lg" w="full">
      <InputLeftElement>
        <Icon color="#858585" size={20} as={MagnifyingGlass} />
      </InputLeftElement>
      <Input
        placeholder={placeholder}
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        colorScheme="primary"
        onChange={handleOnChange}
      />
    </InputGroup>
  )
}

export default SearchBar
