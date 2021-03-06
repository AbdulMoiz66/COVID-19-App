import * as React from 'react';
import {useState, Animated,Image } from 'react';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Button
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'react-native-elements'

const Country=({navigation, route})=>{
  const [getCountry, setCountry] = useState(route.params.countryName);
  const [getPopulation, setPopulation] = useState('');
  const [getNew,setNew] = useState('');
  const [getTotal,setTotal] = useState('');
  const [getDeaths, setDeaths] = useState('');
  const [getCritical, setCritical] = useState('');
  const [getUpdate,setUpdate] = useState('');
  const [getfav,setfav] = useState([]);
  

  const options = {
  method: 'GET',
  url: 'https://covid-193.p.rapidapi.com/statistics',
  params: {country: getCountry},
  headers: {
    'x-rapidapi-key': 'your own key',
    'x-rapidapi-host': 'covid-193.p.rapidapi.com'
  }
};

  const updateData = async (country) => {
     AsyncStorage.getItem( 'Country' )
    .then( data => {
      data = JSON.parse( data );
      var temp =[...data,country];
      setfav(temp);
      console.log(temp);
      //save the value to AsyncStorage again
      AsyncStorage.setItem( 'Country', JSON.stringify( temp ) );

    }).done();
  }

const saveData = async () => {
  try {
    await AsyncStorage.setItem("Country", JSON.stringify( getfav ));
    console.log('Data successfully saved')
  } catch (e) {
    console.log('Failed to save data into storage')
  }
}

 const setFavourite=(country)=>{
    updateData(country);
    //saveData();
    
  }

axios.request(options).then(function (response) {
	console.log(response.data.response[0]);
  setNew(JSON.stringify(response.data.response[0].cases.new));
  setTotal(JSON.stringify(response.data.response[0].cases.total));
  setDeaths(JSON.stringify(response.data.response[0].deaths.total));
  setCritical(JSON.stringify(response.data.response[0].cases.critical));
  setPopulation(JSON.stringify(response.data.response[0].population));
  setUpdate(JSON.stringify(response.data.response[0].time));
}).catch(function (error) {
	console.error(error);
});

navigation.setOptions({
		headerRight: () => 
      <Icon
  name='g-translate'
  color='#7300ed'
  onPress={()=>setFavourite(getCountry)} />
			// <Button
			// 	title="Favourite"
			// 	disabled={false}
			// 	onPress={()=>setFavourite(getCountry)}
			// />
    
	});



  return (
    <View style={styles.container}>
      <Text style={{fontSize:25, fontWeight:"bold" , backgroundColor: "black", color :"violet", width:"100%", textAlign:"center"}}>{getCountry}</Text>
      <View style={styles.container}>
      <View>
      
      <Text style={{fontSize:20,fontWeight:"bold", borderBottomWidth:3,borderColor:"purple"}}>New Cases: {getNew}</Text>
      
      <Text style={{fontSize:20,fontWeight:"bold", borderBottomWidth:3,borderColor:"purple"}}>Total Cases: {getTotal}</Text>
      <Text style={{fontSize:20,fontWeight:"bold", borderBottomWidth:3,borderColor:"purple"}}>Total Deaths: {getDeaths}</Text>
      </View><View>
      <Text style={{fontSize:20,fontWeight:"bold", borderBottomWidth:3,borderColor:"purple"}}>Population: {getPopulation}</Text>
      <Text style={{fontSize:20,fontWeight:"bold", borderBottomWidth:3,borderColor:"purple"}}>Case Ratio: {parseInt(getTotal/getPopulation*100)}</Text>
      </View><View>
      <Text style={{fontSize:15,fontWeight:"bold", borderBottomWidth:3,borderColor:"violet"}}>Last Updated:{getUpdate}</Text>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
 
});

export default Country; 
