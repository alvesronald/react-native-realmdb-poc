import React from 'react';
import Realm from 'realm';
import TaskSchema from '../schemas/task';

export async function getRealm(){
    return Realm.open({
        path:'myRealm',
        schema:[TaskSchema],
        schemaVersion:1
    })
}