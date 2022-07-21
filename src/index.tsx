import React, { useEffect, useState } from "react";
import { 
    FlatList,
    SafeAreaView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View 
} from "react-native";
import { getRealm } from "./config/reaml";


export default function Application(){
    const [title, setTitle] = useState('')   
    const [tasks, setTasks] = useState<any>([]) 

    useEffect(() => {
        async function loadTasks(){
            const realm = await getRealm();

            const realmTasks = await realm.objects('Task')

            console.log(realmTasks)
            setTasks(realmTasks)
        }

        loadTasks()
    },[])

   async function createTask(){
        if(!title){
            return
        }

       try {
            const _id = `task-${String(Math.random())}`
            console.log(_id)

            const realm = await getRealm();

            realm.write(() => {
                realm.create('Task', {
                    title,
                    _id,
                    status: 'Todo'
                })
            })
       } catch (error) {
        console.log(error)
       }

    }


    return(
        <SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1 }}>
                <FlatList
                    keyExtractor={task => task._id}
                    data={tasks}
                    renderItem={({item, index}) => (
                        <View style={{ marginHorizontal: 10 }}>
                            <Text style={styles.task}>{index + 1} - {item.title}</Text>
                        </View>
                    )}                
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder="Titulo da task" 
                    placeholderTextColor='black' 
                    style={styles.input}  
                    value={title}
                    onChangeText={text => setTitle(text)}
                />
                <TouchableOpacity style={styles.button} onPress={createTask}>
                    <Text style={styles.buttonText}>Criar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    inputContainer:{
        position:'absolute',
        bottom:90,
        width: '100%',
        flexDirection: 'row',
        justifyContent:'center'
    },
    input:{
        width: '70%',
        borderWidth:1,
        borderColor:'gray',
        padding: 20
    },
    button:{
        padding: 20,
        backgroundColor: 'tomato'
    },
    buttonText:{
        color:'#FFFF'        
    },
    task:{
        fontSize: 22
    }
})