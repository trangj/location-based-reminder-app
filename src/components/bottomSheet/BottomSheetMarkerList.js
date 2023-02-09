import dayjs from 'dayjs'
import { Divider, IconButton, SearchIcon, Text, VStack, Icon, HStack, CloseIcon, useColorModeValue, Button, useTheme } from 'native-base'
import React, { forwardRef, useEffect } from 'react'
import { Alert } from 'react-native'
import { useMarkerStore } from '../../stores/markerStore'
import CustomBottomSheetModal from '../../ui/CustomBottomSheetModal'
import ListItem from '../../ui/ListItem'
import EmptyMarkerList from '../placeholders/EmptyMarkerList'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useCustomActionSheet } from '../../hooks/useCustomActionSheet'
import ListSkeleton from '../placeholders/ListSkeleton'
import BottomSheetInputWrapper from '../../ui/BottomSheetInputWrapper'
import BottomSheetSearch from './BottomSheetSearch'
import { useState } from 'react'
import { useGroupStore } from '../../stores/groupStore'
import { Keyboard } from 'react-native'
import BottomSheetFlatListWrapper from './BottomSheetFlatListWrapper'
import { Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { useCustomToast } from '../../hooks/useCustomToast'

const BottomSheetMarkerList = forwardRef((
  {
    setCurrentMarkerId,
    setNewMarker
  }, 
  { 
    bottomSheetMarkerListRef, 
    bottomSheetReminderListRef,
    bottomSheetAddMarkerRef,
    mapRef, 
  }) => {

  const toast = useCustomToast()
  const { showCustomActionSheetWithOptions } = useCustomActionSheet();
  const { colors, space } = useTheme();
  const color = useColorModeValue('gray.500', 'gray.400')
  const bg = useColorModeValue(colors.white, colors.gray[900])
  
  const markers = useMarkerStore(state => state.markers);
  const fetchMarkers = useMarkerStore(state => state.fetchMarkers);
  const pinMarker = useMarkerStore(state => state.pinMarker);
  const group = useGroupStore(state => state.group)
  const loading = useMarkerStore(state => state.loading);
  const deleteMarker = useMarkerStore(state => state.deleteMarker);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchView, setSearchView] = useState(false);
  const [order, setOrder] = useState({ query: "name" });

  async function handleDeleteMarker(markerId) {
    try {
      await deleteMarker(markerId)
      toast.show({description: "Successfuly deleted marker"})
    } catch (error) {
      toast.show({description: error.message})
    }
  }

  function handlePress(markerId) {
    const options = ['View Reminders', 'Pin Marker', 'Delete Marker', 'Cancel'];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 3;

    showCustomActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case 0:
          setCurrentMarkerId(markerId)
          bottomSheetReminderListRef.current.present()
          break;
        case 1:
          pinMarker(markerId);
          break;
        case destructiveButtonIndex:
          Alert.alert("Delete marker?", "Are you sure you want to delete this marker?", [
            {
              text: "Cancel",
              style: 'cancel'
            },
            {
              text: "Delete",
              style: 'destructive',
              onPress: () => handleDeleteMarker(markerId)
            }
          ])
          break;

        case cancelButtonIndex:
          // Canceled
      }});
  }

  const handleOrder = ({ query = undefined, options = undefined}) => {
    fetchMarkers(group.id, query, options)
    setOrder({ query, options })
  }

  //reset query when group changes
  useEffect(() => {
    setOrder({ query: "name" })
  }, [group])

  return (
    <CustomBottomSheetModal 
      ref={bottomSheetMarkerListRef}
      header={
        <HStack
          mx="3"
          mb="3"
          alignItems="center"
          justifyContent="center"
          space="2"
        >
          <BottomSheetInputWrapper
            flex="1"
            key="searchInput" 
            variant="alt"
            placeholderTextColor={color}
            placeholder="Search Map"
            InputLeftElement={<SearchIcon ml="3" />}
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
            onFocus={() => setSearchView(true)}
          />
          {searchView && (
            <IconButton 
              variant="header"
              icon={<CloseIcon size="sm" />}
              onPress={() => {
                setSearchView(false)
                setNewMarker(null)
                setSearchQuery("")
                Keyboard.dismiss();
              }}
            />
          )}
        </HStack>
      }
    >
      {searchView ? (
        <BottomSheetSearch
          setNewMarker={setNewMarker} 
          setSearchView={setSearchView}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery} 
          ref={{ 
            bottomSheetAddMarkerRef, 
            bottomSheetMarkerListRef,
            mapRef, 
          }}
        />
      ) : (
        <BottomSheetFlatListWrapper
          data={markers}
          keyExtractor={(marker) => marker.id}
          ItemSeparatorComponent={() => (<Divider />)}
          ListEmptyComponent={loading ? ListSkeleton : EmptyMarkerList}
          ListHeaderComponent={
            <ScrollView 
              horizontal 
              contentInset={{ left: 12, right: 12 }}
              contentOffset={{ x: -12 }}
              contentContainerStyle={{ paddingHorizontal: Platform.OS === 'android' ? 12 : undefined }}
              showsHorizontalScrollIndicator={false}
              style={{ paddingBottom: space[2], backgroundColor: bg }}
            >
              <Button 
                variant={order.query === "name" ? "headerActive" : "header"}
                size="sm"
                onPress={() => handleOrder({ query: "name" })}
              >
                Alphabetical
              </Button>
              <Button 
                variant={order.query === "pinned" ? "headerActive" : "header"}
                size="sm"
                ml="2"
                onPress={() => handleOrder({ query: "pinned", options: { ascending: false }})}
              >
                Pinned
              </Button>
              <Button 
                variant={order.query === "created_at" ? "headerActive" : "header"}
                size="sm"
                ml="2"
                onPress={() => handleOrder({ query: "created_at", options: { ascending: false }})}
              >
                Most Recent
              </Button>
              <Button 
                variant={order.query === "number_of_reminders" ? "headerActive" : "header"}
                size="sm"
                ml="2"
                onPress={() => handleOrder({ query: "number_of_reminders", options: { ascending: false }})}
              >
                Most Reminders
              </Button>
              <Button 
                variant={order.query === "updated_at" ? "headerActive" : "header"}
                size="sm"
                ml="2"
                onPress={() => handleOrder({ query: "updated_at", options: { ascending: false }})}
              >
                Recently Updated
              </Button>
            </ScrollView>
          }
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
              onLongPress={() => {
                setCurrentMarkerId(item.id)
                bottomSheetReminderListRef.current.present()
              }}
              justifyContent="space-between"
            >
              <VStack>
                <Text fontWeight="medium">
                  {item.name}
                </Text>
                <Text variant="alt">
                  {dayjs(item.created_at).format('DD-MM-YYYY')} {'\u2022'} {item.number_of_reminders} reminder{item.number_of_reminders === 1 ? '' : 's'}
                </Text>
              </VStack>
              <IconButton icon={<Icon as={Ionicons} name="ellipsis-horizontal" size="md" color={color} />} colorScheme="gray" onPress={() => handlePress(item.id)} />
            </ListItem>
          )}
        />
      )}
    </CustomBottomSheetModal>
  )
})

export default BottomSheetMarkerList