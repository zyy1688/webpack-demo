import Vue from 'vue'
import App from './app.vue'
import testcss from './assets/styles/test.css'
/*import testcss from './assets/images/15.jpg'*/
const root=document.createElement('div')
document.body.appendChild(root)
new Vue({
    render:(h)=>h(App)
}).$mount(root)