import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import Todo from '../../screen/tasks/Todo';
import AddCategory from '../../screen/tasks/AddCategory';
import AddSubCategory from "../../screen/tasks/AddSubCategory";
import SubCategory from "../../screen/tasks/SubCategory";
import CategoryItems from '../../screen/tasks/CategoryItems';
import AddCategoryItem from '../../screen/tasks/AddCategoryItem';
import ViewItem from '../../screen/tasks/ViewItem';
import SearchByTasks from "../../screen/tasks/SearchByTasks";
import UserTaskItem from "../../screen/tasks/UserTaskItem";
import NewAssignScreen from '../../screen/tasks/NewAssign';
import TaskSearchResult from '../../screen/tasks/TaskSearchResult';
import EditPhotoCatItem from '../../screen/tasks/EditPhotoCatItem';
import PendingTask from '../../screen/tasks/PendingTasks';


const Stack = createStackNavigator();

export default function StackNav() {
    return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Todo" component={Todo} />
                <Stack.Screen name="AddCategory" component={AddCategory} />
                <Stack.Screen name="AddSubCategory" component={AddSubCategory} />
                <Stack.Screen name="SubCategory" component={SubCategory} />
                <Stack.Screen name="CategoryItems" component={CategoryItems} />
                <Stack.Screen name="AddCategoryItem" component={AddCategoryItem} />
                <Stack.Screen name="ViewItem" component={ViewItem} />
                <Stack.Screen name="SearchByTasks" component={SearchByTasks} />
                <Stack.Screen name="UserTaskItem" component={UserTaskItem} />
                <Stack.Screen name="NewAssignScreen" component={NewAssignScreen} />
                <Stack.Screen name="TaskSearchResult" component={TaskSearchResult} />
                <Stack.Screen name="EditPhotoCatItem" component={EditPhotoCatItem} />
                <Stack.Screen name="PendingTask" component={PendingTask} />
            </Stack.Navigator>
    );
}
