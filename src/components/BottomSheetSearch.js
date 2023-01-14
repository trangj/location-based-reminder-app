import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { Divider, Text, VStack, HStack, IconButton, CloseIcon, Input } from 'native-base'
import React, { forwardRef } from 'react'
import { useState } from 'react'
import CustomBottomSheetModal from '../ui/CustomBottomSheetModal'
import ListItem from '../ui/ListItem'

const BottomSheetSearch = forwardRef((
  {
  }, 
  { 
    bottomSheetSearchRef, 
    mapRef, 
  }) => {

  const [results, setResults] = useState([]);
    
  return (
    <CustomBottomSheetModal ref={bottomSheetSearchRef}>
      <BottomSheetFlatList
        ListHeaderComponent={() => (
          <VStack>
            <HStack
              alignItems="center"
              justifyContent="center"
              p="2"
            >
              <Text fontSize="2xl" fontWeight="bold">Search</Text>
              <HStack
                ml="auto"
                space="2"
                mr="2"
              >
                <IconButton 
                  colorScheme="gray"
                  borderRadius="full"
                  variant="subtle"
                  size="sm"
                  icon={<CloseIcon />}
                  onPress={() => bottomSheetSearchRef.current.dismiss()}
                />
              </HStack>
            </HStack>
            <Input mx="2" size="xs" />
          </VStack>
        )}
        data={results}
        keyExtractor={(result) => result.id}
        ItemSeparatorComponent={() => (<Divider />)}
        renderItem={({item}) => (
          <ListItem
            onPress={() => 
              mapRef.current.animateToRegion({
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02
              })
            }
            justifyContent="space-between"
          >
            <VStack>
              <Text>
                {item.name}
              </Text>
            </VStack>
          </ListItem>
        )}
      />
    </CustomBottomSheetModal>
  )
})

export default BottomSheetSearch