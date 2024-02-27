import {createApp} from 'vue'
import App from './App.vue'
import sparql from "@/providers/SparqlEndpointProvider";
import classInfo from "@/providers/ClassInfoProvider";
import property from "@/providers/SparqlPropertyProvider";
import stateProvider from '@/providers/OntoExplorerStateProvider'
import VueToast from 'vue-toast-notification';
import {loadPrefixes} from "@/util/prefix-cc";

sparql.loadOrDefault("default-config.json");

const app = createApp(App);
app.provide('sparql', sparql);
app.provide('classInfo', classInfo);
app.provide('property', property);
app.provide('oeState', stateProvider);
app.use(VueToast, {position: 'top-right'});


loadPrefixes().then(() => app.mount('#app'));
