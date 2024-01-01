import React, { useContext }  from "react";
import {View,Text} from 'react-native';
import Input from "../../components/Input";
import { GlobalContext } from "../../Context/GlobalStates";

function AddPost(){
    const {setCaption} = useContext(GlobalContext)
    return(
        <View>
            <View>
            <Text>Bir şeyler yaz !</Text>
            <Input placeholder={"Ne Hissediyorsun :)"} borderWidth={1} borderRadius={10} borderColor={'grey'} onChangeText={(text)=> setCaption(text)}/>
            </View>
            
        </View>
    )
}

export default AddPost;