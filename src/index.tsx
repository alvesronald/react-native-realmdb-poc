import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {getRealm} from './config/reaml';

interface TaskProps {
  _id: string;
  title: string;
  status: string;
}

export default function Application() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  async function loadTasks() {
    const realm = await getRealm();

    console.log('PATH', realm.path);

    const realmTasks = await realm.objects<TaskProps[]>('Task');

    setTasks(realmTasks.toJSON());
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask() {
    try {
      const _id = `task-${String(Math.random() * 100000000000)}`;

      const realm = await getRealm();

      realm.write(() => {
        realm.create<TaskProps>('Task', {
          title,
          _id,
          status: 'Todo',
        });
      });

      loadTasks();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <FlatList
          keyExtractor={task => task._id}
          data={tasks}
          renderItem={({item, index}) => (
            <View style={{marginHorizontal: 10}}>
              <Text style={styles.task}>
                {index + 1} - {item.title}
              </Text>
            </View>
          )}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Titulo da task"
          placeholderTextColor="black"
          style={styles.input}
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <TouchableOpacity style={styles.button} onPress={createTask}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: 'absolute',
    bottom: 90,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    width: '70%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 20,
  },
  button: {
    padding: 20,
    backgroundColor: 'tomato',
  },
  buttonText: {
    color: '#FFFF',
  },
  task: {
    fontSize: 22,
  },
});
