import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/main.css";
import App from "./App.vue";
import router from "./router";
import "@oruga-ui/oruga-next/dist/oruga.css";
import Oruga from "@oruga-ui/oruga-next";

const app = createApp(App).use(Oruga);

app.use(createPinia());
app.use(router);

app.mount("#app");
