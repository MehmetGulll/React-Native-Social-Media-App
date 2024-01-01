import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'

function Button({text, onPress,backgroundColor,color,padding}){
    return(
        <TouchableOpacity style = {{backgroundColor:backgroundColor,alignItems:'center', padding:padding, borderRadius:25}} onPress={onPress}>
            <Text style = {{color:color, fontSize:22, fontWeight:'700'}}>{text}</Text>
        </TouchableOpacity>
    )
}

export default Button;